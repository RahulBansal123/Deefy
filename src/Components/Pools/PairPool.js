import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toggleLoading } from '../../Store/actionCreatos/auth';

const PairPool = ({ title, refetchInterval, chainId, pool, toggleLoading }) => {
  const [data, setData] = useState([]);

  const [{ data: apiData }, refetch, cancelRequest] = useAxios({
    url: `https://api.covalenthq.com/v1/${chainId}/xy=k/${pool}/pools/?quote-currency=USD&format=JSON&page-size=10&key=${process.env.REACT_APP_COVALENT_API_KEY}`,
    method: 'GET',
    timeout: 20000,
  });

  useEffect(() => {
    async function fetchData() {
      await cancelRequest();
      try {
        setData([]);
        await refetch();
      } catch (e) {
        console.error('Please try again');
      }
    }
    fetchData();
  }, [cancelRequest, chainId, refetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, refetchInterval);
    return () => {
      clearInterval(interval);
    };
  }, [refetch, refetchInterval]);

  useEffect(() => {
    if (apiData) {
      setData(apiData.data.items);
      toggleLoading(false);
    }
  }, [apiData, toggleLoading]);

  function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
      var suffixes = ['', 'K', 'M', 'B', 'T'];
      var suffixNum = Math.floor(('' + value).length / 3);
      var shortValue = '';
      for (var precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum !== 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision)
        );
        var dotLessShortValue = (shortValue + '').replace(
          /[^a-zA-Z 0-9]+/g,
          ''
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(1);
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  }

  return (
    <div className="col-md-12 col-lg-12">
      <div className="card table-widget" style={{ height: '95%' }}>
        <div className="card-body">
          <div className="d-flex" style={{ alignItems: 'center' }}>
            <h5 className="card-title" style={{ flex: 1 }}>
              {title}
            </h5>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr className="bold-header">
                  <th scope="col">Name</th>
                  <th scope="col">Liquidity</th>
                  <th scope="col">Volume(24H)</th>
                  <th scope="col">Volume(7D)</th>
                  <th scope="col">Swap(24H)</th>
                  <th scope="col">Fees(24H)</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span className="badge bg-info">
                        {item.token_0.contract_name}
                      </span>{' '}
                      -{' '}
                      <span className="badge bg-info">
                        {item.token_1.contract_name}
                      </span>
                    </td>
                    <td>${abbreviateNumber(item.total_liquidity_quote)}</td>
                    <td>${abbreviateNumber(item.volume_24h_quote)}</td>
                    <td>${abbreviateNumber(item.volume_7d_quote)}</td>
                    <td>{abbreviateNumber(item.swap_count_24h)}</td>
                    <td>{abbreviateNumber(item.fee_24h_quote)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  chainId: state.auth.chainId,
  pool: state.auth.pool,
  isDataLoading: state.auth.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  toggleLoading: (loading) => {
    dispatch(toggleLoading(loading));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(PairPool);
