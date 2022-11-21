import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useQuery } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import SearchCard from '../SearchCard';
import Loading from '../Loading';
const SearchPage = () => {
  const {
    globalSearch: { data: searchResult, loading: searchLoading },
  } = useSelector((state) => state.search);
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('term'));

  return (
    <>
      {
        <div class="alert">
          <div class="container">
            <div class="alert__wrap">
              {searchParams.get('term') ? (
                <>
                  <div className="alert__title search__title">{`Результать по "${searchParams.get('term')}"`}</div>
                  {!searchLoading ? (
                    searchResult?.count ? (
                      <>
                        <>
                          {searchResult?.news?.map((newsItem) => (
                            <SearchCard link={`/news/${newsItem?.id}`} title={newsItem?.title} desc={newsItem?.descShort} />
                          ))}
                        </>
                        <>
                          {searchResult?.study?.map((newsItem) => (
                            <SearchCard link={`/news/${newsItem?.id}`} title={newsItem?.title} desc={newsItem?.descShort} />
                          ))}
                        </>
                        <>
                          {searchResult?.testing?.map((testItem) => (
                            <SearchCard linkBlank link={testItem?.linkTest} title={testItem?.name} desc={testItem?.desc} />
                          ))}
                        </>
                      </>
                    ) : (
                      <div class="not-found" style={{ marginTop: '80px' }}>
                        Ничего не найдено
                      </div>
                    )
                  ) : (
                    <Loading />
                  )}
                </>
              ) : (
                <div class="not-found" style={{ marginTop: '100px' }}>
                  Введите текст в строку поиска
                </div>
              )}
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default SearchPage;
