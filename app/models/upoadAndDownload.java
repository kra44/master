 public Response<Map<String, Object>> geLastSondeByState(Request<SondeStatsDto> request, Locale locale) {
        Response<Map<String, Object>> response = new Response<Map<String, Object>>();
        List<Map<String, Object>>     items    = new ArrayList<Map<String, Object>>();
      
        try {
                SondeStatsDto dto = request.getData();
                
                if (Utilities.isBlank(dto.getDate()) && !Utilities.searchParamIsNotEmpty(dto.getDate_param())) {
                    throw new RuntimeException("Aucune date spécifiée.");
                }

                if (Utilities.searchParamIsNotEmpty(dto.getDate_param())) {
                    dto.setDate(dto.getDate_param().getEnd());
                }
                
                else {
                    dto.setDate_param(new SearchParam<String>(OperatorEnum.BETWEEN, dto.getDate(), dto.getDate()));
                }

            if (Utilities.searchParamIsNotEmpty(dto.getDate_param())) {
                dto.setDate(dto.getDate_param().getEnd());
            }
            
            else {
                dto.setDate_param(new SearchParam<String>(OperatorEnum.BETWEEN, dto.getDate(), dto.getDate()));
            }
                // Init es client
                RestHighLevelClient client = highClientFactory.getClient();
                // get indeces
                String[] indices = esSondeStatsRepository.getIndices(dto, highClientFactory, esConfig.getReadQoeIndicatorIndexName(), true);

                AggregationBuilder rootAgg = AggregationBuilders
                                    .terms(EsSondeFieldEnum.STATUS)
                                    .field(EsSondeFieldEnum.STATUS)
                                    .size(esConfig.getMaxClauseCount())
                                    .subAggregation(
                                            AggregationBuilders
                                                    .terms(EsSondeFieldEnum.KEY_REFERENCE)
                                                    .field(EsSondeFieldEnum.KEY_REFERENCE)
                                                    .size(esConfig.getMaxClauseCount())
                                                    .subAggregation(
                                                              AggregationBuilders
                                                                    .terms(EsSondeFieldEnum.SCENARIO_CODE)
                                                                    .field(EsSondeFieldEnum.SCENARIO_CODE)
                                                                    .order(BucketOrder.key(false))
                                                                    .size(1)
                                                                    .subAggregation(
                                                                              AggregationBuilders
                                                                                .terms(EsSondeFieldEnum.SONDE_NAME)
                                                                                .field(EsSondeFieldEnum.SONDE_NAME)
                                                                                .size(esConfig.getMaxClauseCount())
                                                                                .subAggregation(
                                                                                        AggregationBuilders
                                                                                        .topHits(EsSondeFieldEnum.SONDE_NAME)
                                                                                        .sort(EsSondeFieldEnum.DATE_DEBUT_EXECUTION, SortOrder.DESC)
                                                                                        .fetchSource(
                                                                                                new String[]{
                                                                                                        EsSondeFieldEnum.KEY_REFERENCE,
                                                                                                        EsSondeFieldEnum.VALUE,
                                                                                                        EsSondeFieldEnum.SONDE_NAME,
                                                                                                        EsSondeFieldEnum.STATUS
                                                                                                }, null
                                                                                        )
                                                                                       .size(1)
                                               )              )    
                                )
                        );

                
                BoolQueryBuilder    ispBoolQuery  = esSondeStatsRepository.generateCriteria(dto);
               
                SearchSourceBuilder sourceBuilder = HighClientEsUtils.getSearchSourceBuilder(ispBoolQuery, 0, 0);
                
                // add main agg
                sourceBuilder.aggregation(rootAgg);
              
                SearchRequest searchRequest = HighClientEsUtils.getSearchRequest(indices);
                searchRequest.source(sourceBuilder);
               
                SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
                
                if (searchResponse != null && searchResponse.getAggregations() != null && searchResponse.getHits() != null) {
                    
                     //get sonde 
                    Terms rooTerms = EsUtils.getAggregation(searchResponse.getAggregations(), EsSondeFieldEnum.STATUS, Terms.class);
                    for(Terms.Bucket rootBucket : rooTerms.getBuckets()) {
                    	Map<String, Object> map = new HashMap<>();
                        final String statusName = rootBucket.getKeyAsString();
                        
                         //get scenario
                        Terms statusTerms = EsUtils.getAggregation(rootBucket.getAggregations(), EsSondeFieldEnum.KEY_REFERENCE, Terms.class);
                        for(Terms.Bucket statusBucket : statusTerms.getBuckets()) {
                            final String keyRef= statusBucket.getKeyAsString();
                        
                            //get key reference
                            List<Map<String, Object>> sondeMapperList = new ArrayList<Map<String, Object>>();
                            
                            Terms scenaioCodeTerms = EsUtils.getAggregation(statusBucket.getAggregations(), EsSondeFieldEnum.SCENARIO_CODE, Terms.class);
                              for(Terms.Bucket scenarioBucket : scenaioCodeTerms.getBuckets()) {
                                  
                                  
                                  Map<String, Object> sondeMap = new HashMap<>();
                                  Terms sondeTerms = EsUtils.getAggregation(scenarioBucket.getAggregations(), EsSondeFieldEnum.SONDE_NAME, Terms.class);
                                  for(Terms.Bucket sonndeBucket : sondeTerms.getBuckets()) {
                                   
                                      final Long getCount = sonndeBucket.getDocCount();
                                     
                                            TopHits topHit = EsUtils.getAggregation(sonndeBucket.getAggregations(), EsSondeFieldEnum.SONDE_NAME, TopHits.class);
                                             if(topHit !=null && topHit.getHits() != null) {
                                              List<EsSondeMapperDto>          allSondeMapperList = new ArrayList<>();
                                              allSondeMapperList = new EsTransformer(EsSondeMapperDto.class).toDtos(topHit.getHits());
                                                
                                                final EsSondeMapperDto esSondeMapperDto = allSondeMapperList.stream().findFirst().orElse(new EsSondeMapperDto());
                                                sondeMap.put(EsSondeFieldEnum.SONDE_NAME, esSondeMapperDto.getSondeName());
                                             } 
                                             
                                           sondeMapperList.add(sondeMap);
                                           map.put(keyRef, getCount);
                                      }
                                  
                            }
                              map.put(keyRef, sondeMapperList.size());
                              
                              map.put("status", statusName);
                        }
                        items.add(map);  
                          
                    }
                }

                response.setItems(items);
            } catch (PermissionDeniedDataAccessException e) {
                exceptionUtils.PERMISSION_DENIED_DATA_ACCESS_EXCEPTION(response, locale, e);
            } catch (DataAccessResourceFailureException e) {
                exceptionUtils.DATA_ACCESS_RESOURCE_FAILURE_EXCEPTION(response, locale, e);
            } catch (DataAccessException e) {
                exceptionUtils.DATA_ACCESS_EXCEPTION(response, locale, e);
            } catch (RuntimeException e) {
                exceptionUtils.RUNTIME_EXCEPTION(response, locale, e);
            } catch (Exception e) {
                exceptionUtils.EXCEPTION(response, locale, e);
            } finally {
                if (response.isHasError() && response.getStatus() != null) {
                    log.info("Erreur| code: {} -  message: {}", response.getStatus().getCode(), response.getStatus().getMessage());
                    throw new RuntimeException(response.getStatus().getCode() + ";" + response.getStatus().getMessage());
                }
            }
            return response;
    }





public Response<Map<String, Object>> geLastSondeByState(Request<SondeStatsDto> request, Locale locale) {
        Response<Map<String, Object>> response = new Response<Map<String, Object>>();
        List<Map<String, Object>>     items    = new ArrayList<Map<String, Object>>();
      
        try {
                SondeStatsDto dto = request.getData();
                
                if (Utilities.isBlank(dto.getDate()) && !Utilities.searchParamIsNotEmpty(dto.getDate_param())) {
                    throw new RuntimeException("Aucune date spécifiée.");
                }

                if (Utilities.searchParamIsNotEmpty(dto.getDate_param())) {
                    dto.setDate(dto.getDate_param().getEnd());
                }
                
                else {
                    dto.setDate_param(new SearchParam<String>(OperatorEnum.BETWEEN, dto.getDate(), dto.getDate()));
                }

            if (Utilities.searchParamIsNotEmpty(dto.getDate_param())) {
                dto.setDate(dto.getDate_param().getEnd());
            }
            
            else {
                dto.setDate_param(new SearchParam<String>(OperatorEnum.BETWEEN, dto.getDate(), dto.getDate()));
            }
                // Init es client
                RestHighLevelClient client = highClientFactory.getClient();
                // get indeces
                String[] indices = esSondeStatsRepository.getIndices(dto, highClientFactory, esConfig.getReadQoeIndicatorIndexName(), true);

                AggregationBuilder rootAgg = AggregationBuilders
                                    .terms(EsSondeFieldEnum.DESCRIPTION)
                                    .field(EsSondeFieldEnum.DESCRIPTION)
                                    .size(esConfig.getMaxClauseCount())
                                    .subAggregation(
                                            
                                             AggregationBuilders
                                               .terms(EsSondeFieldEnum.SCENARIO_CODE)
                                               .field(EsSondeFieldEnum.SCENARIO_CODE)
                                               .size(esConfig.getMaxClauseCount())
                                               .subAggregation(
                                                                     AggregationBuilders
                                                                     .terms(EsSondeFieldEnum.STATUS)
                                                                     .field(EsSondeFieldEnum.STATUS)
                                                                     .order(BucketOrder.key(false))
                                                                     .size(1)
                                                                     .subAggregation(
                                                                              AggregationBuilders
                                                                              .terms(EsSondeFieldEnum.KEY_REFERENCE)
                                                                              .field(EsSondeFieldEnum.KEY_REFERENCE)
                                                                              .size(esConfig.getMaxClauseCount())
                                                                              .subAggregation(
                                                                                     
                                                                                          AggregationBuilders
                                                                                            .terms(EsSondeFieldEnum.SONDE_NAME)
                                                                                            .field(EsSondeFieldEnum.SONDE_NAME)
                                                                                            .size(esConfig.getMaxClauseCount())
                                                                                            .subAggregation(
                                                                                                    AggregationBuilders
                                                                                                    .topHits(EsSondeFieldEnum.SONDE_NAME)
                                                                                                    .sort(EsSondeFieldEnum.DATE_DEBUT_EXECUTION, SortOrder.DESC)
                                                                                                    .fetchSource(
                                                                                                            new String[]{
                                                                                                                    EsSondeFieldEnum.KEY_REFERENCE,
                                                                                                                    EsSondeFieldEnum.VALUE,
                                                                                                                    EsSondeFieldEnum.SONDE_NAME,
                                                                                                                    EsSondeFieldEnum.STATUS
                                                                                                            }, null
                                                                                                    )
                                                                       )                .size(1)
                                               )              )    
                                )
                        );

                
                BoolQueryBuilder    ispBoolQuery  = esSondeStatsRepository.generateCriteria(dto);
               
                SearchSourceBuilder sourceBuilder = HighClientEsUtils.getSearchSourceBuilder(ispBoolQuery, 0, 0);
                
                // add main agg
                sourceBuilder.aggregation(rootAgg);
              
                SearchRequest searchRequest = HighClientEsUtils.getSearchRequest(indices);
                searchRequest.source(sourceBuilder);
               
                SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
                
                if (searchResponse != null && searchResponse.getAggregations() != null && searchResponse.getHits() != null) {
                    
                     //get sonde 
                    Terms rooTerms = EsUtils.getAggregation(searchResponse.getAggregations(), EsSondeFieldEnum.DESCRIPTION, Terms.class);
                    for(Terms.Bucket rootBucket : rooTerms.getBuckets()) {
                        Map<String, Object> map = new HashMap<>();
                        final String descriptionName = rootBucket.getKeyAsString();
                       

                        Terms scenarioCodeTerms = EsUtils.getAggregation(rootBucket.getAggregations(), EsSondeFieldEnum.SCENARIO_CODE, Terms.class);
                        for(Terms.Bucket scenarioBucket : scenarioCodeTerms.getBuckets()) {
                             
                            Terms statusTerms = EsUtils.getAggregation(scenarioBucket.getAggregations(), EsSondeFieldEnum.STATUS, Terms.class);
                            for(Terms.Bucket statusBucket : statusTerms.getBuckets()) {
                                final String statusName = statusBucket.getKeyAsString();
                            
                          
                            
                            Terms keyRefTerms = EsUtils.getAggregation(statusBucket.getAggregations(), EsSondeFieldEnum.KEY_REFERENCE, Terms.class);
                              for(Terms.Bucket keyRefBucket : keyRefTerms.getBuckets()) {
                                  final String keyRef= keyRefBucket.getKeyAsString();
                                  
                                  Map<String, Object> sondeMap = new HashMap<>();
                                 
                                
                                      
                                  Terms sondeTerms = EsUtils.getAggregation(keyRefBucket.getAggregations(), EsSondeFieldEnum.SONDE_NAME, Terms.class);
                                  for(Terms.Bucket sonndeBucket : sondeTerms.getBuckets()) {
                                   
                                      final Long getCount = sonndeBucket.getDocCount();
                                     
                                            TopHits topHit = EsUtils.getAggregation(sonndeBucket.getAggregations(), EsSondeFieldEnum.SONDE_NAME, TopHits.class);
                                             if(topHit !=null && topHit.getHits() != null) {
                                              List<EsSondeMapperDto>          allSondeMapperList = new ArrayList<>();
                                              allSondeMapperList = new EsTransformer(EsSondeMapperDto.class).toDtos(topHit.getHits());
                                                
                                                final EsSondeMapperDto esSondeMapperDto = allSondeMapperList.stream().findFirst().orElse(new EsSondeMapperDto());
                                                sondeMap.put(EsSondeFieldEnum.SONDE_NAME, esSondeMapperDto.getSondeName());
                                             } 

                                             map.put(keyRef, getCount);
                                      }
 
                              }
                              map.put("status", statusName);
                            }
                            
                         }
                            map.put("description", descriptionName);
                            items.add(map);     
                    }
                           
                }

                response.setItems(items);
            } catch (PermissionDeniedDataAccessException e) {
                exceptionUtils.PERMISSION_DENIED_DATA_ACCESS_EXCEPTION(response, locale, e);
            } catch (DataAccessResourceFailureException e) {
                exceptionUtils.DATA_ACCESS_RESOURCE_FAILURE_EXCEPTION(response, locale, e);
            } catch (DataAccessException e) {
                exceptionUtils.DATA_ACCESS_EXCEPTION(response, locale, e);
            } catch (RuntimeException e) {
                exceptionUtils.RUNTIME_EXCEPTION(response, locale, e);
            } catch (Exception e) {
                exceptionUtils.EXCEPTION(response, locale, e);
            } finally {
                if (response.isHasError() && response.getStatus() != null) {
                    log.info("Erreur| code: {} -  message: {}", response.getStatus().getCode(), response.getStatus().getMessage());
                    throw new RuntimeException(response.getStatus().getCode() + ";" + response.getStatus().getMessage());
                }
            }
            return response;
    }

   