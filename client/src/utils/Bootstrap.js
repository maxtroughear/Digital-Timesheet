import * as auth from './AuthClient';
// import * as listItemsClient from './list-items-client';

const bootstrapAppData = async () => {
  let appData = { user: null };

  if (auth.isLoggedIn()) {
    const [user, listItems] = await Promise.all([
      auth.getUser(),
      // listItemsClient.read().then((d) => d.listItems),
    ]);
    appData = { user, listItems };
  }
  // queryCache.setQueryData('list-items', appData.listItems);
  return appData;
};

export default bootstrapAppData;
