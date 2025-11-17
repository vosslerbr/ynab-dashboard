Here is how to get an access token for API
```
const accessToken = await auth.api.getAccessToken({
  body: { providerId: "ynab" },
  headers: ctx.headers,
});
```
