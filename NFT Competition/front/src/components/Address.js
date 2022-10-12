function Address({ userAddress }) {
    return (
      <span className>{userAddress.substring(0, 5)}…{userAddress.substring(userAddress.length - 4)}</span>
    );
}

export default Address;