export const Auth = (liff) => {
  liff.getProfile()
    .then((profile) => {
      return profile;
    })
    .catch((e) => {
      return e;
    })
};
