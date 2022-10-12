const initialState = {
    loading: false,
    account: null,
    nftMinter: null,
    w_nftMinter: null,
    voting: null,
    w_voting: null,
    web3: null,
    errorMsg: "",
  };
  
  const blockchainReducer = (state = initialState, action) => {
    switch (action.type) {
      case "CONNECTION_REQUEST":
        return {
          ...initialState,
          loading: true,
        };
      case "CONNECTION_SUCCESS":
        return {
          ...state,
          loading: false,
          account: action.payload.account,
          nftMinter: action.payload.nftMinter,
          w_nftMinter: action.payload.w_nftMinter,
          voting: action.payload.voting,
          w_voting: action.payload.w_voting,
          web3: action.payload.web3,
        };
      case "CONNECTION_FAILED":
        return {
          ...initialState,
          loading: false,
          errorMsg: action.payload,
        };
      case "UPDATE_ACCOUNT":
        return {
          ...state,
          account: action.payload.account,
        };
      default:
        return state;
    }
  };
  
  export default blockchainReducer;