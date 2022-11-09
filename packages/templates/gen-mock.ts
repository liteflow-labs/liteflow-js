import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { writeFileSync } from 'fs'
import {
  BidOnAssetDocument,
  BidOnAssetQuery,
  BidOnAssetQueryVariables,
  CheckoutDocument,
  CheckoutQuery,
  CheckoutQueryVariables,
  FetchAccountAndCollectionsDocument,
  FetchAccountAndCollectionsQuery,
  FetchAccountAndCollectionsQueryVariables,
  FetchAllErc721And1155Document,
  FetchAllErc721And1155Query,
  FetchAllErc721And1155QueryVariables,
  FetchAssetDocument,
  FetchAssetQuery,
  FetchAssetQueryVariables,
  FetchCreatedAssetsDocument,
  FetchCreatedAssetsQuery,
  FetchCreatedAssetsQueryVariables,
  FetchHomePageDocument,
  FetchHomePageQuery,
  FetchHomePageQueryVariables,
  FetchOnSaleAssetsDocument,
  FetchOnSaleAssetsQuery,
  FetchOnSaleAssetsQueryVariables,
  FetchOwnedAssetsDocument,
  FetchOwnedAssetsQuery,
  FetchOwnedAssetsQueryVariables,
  FetchUserAuctionsDocument,
  FetchUserAuctionsQuery,
  FetchUserAuctionsQueryVariables,
  FetchUserBidsPlacedDocument,
  FetchUserBidsPlacedQuery,
  FetchUserBidsPlacedQueryVariables,
  FetchUserBidsReceivedDocument,
  FetchUserBidsReceivedQuery,
  FetchUserBidsReceivedQueryVariables,
  FetchUserFixedPriceDocument,
  FetchUserFixedPriceQuery,
  FetchUserFixedPriceQueryVariables,
  FetchUserTradePurchasedDocument,
  FetchUserTradePurchasedQuery,
  FetchUserTradePurchasedQueryVariables,
  FetchUserTradeSoldDocument,
  FetchUserTradeSoldQueryVariables,
  GetAccountDocument,
  GetAccountQuery,
  GetAccountQueryVariables,
  GetNotificationsDocument,
  GetNotificationsQuery,
  GetNotificationsQueryVariables,
  OfferForAssetDocument,
  OfferForAssetQuery,
  OfferForAssetQueryVariables,
} from './src/graphql'

const client = new ApolloClient({
  link: createHttpLink({
    uri: process.argv[2],
    fetch: require('node-fetch'),
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Account: {
        keyFields: ['address'],
      },
    },
  }),
})

client
  .query<FetchHomePageQuery, FetchHomePageQueryVariables>({
    query: FetchHomePageDocument,
    variables: {
      featuredIds: [
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-49600015852111813047896604022884353921118519942981476140015855675123490232454',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-35830987083353123895755779054112650157316399236059730431728023881104583369287',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-35830987083353123895755779054112650157316399236059730431857079010031714855232',
      ],
      now: new Date('2022-05-22T04:53:29.881Z'),
      limit: 10,
      assetIds: [
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-49600015852111813047896604022884353921118519942981476140033905752223912514566',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-49600015852111813047896604022884353921118519942981476140020247428532621763333',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-36174914148539116512882615125906196155176598740777344057341809415099024308534',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-36174914148539116512882615125906196155176598740777344057337490697616873251958',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-36174914148539116512882615125906196155176598740777344057326027700575544091737',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-97430781528009278955669206608191540911214288583714243278205583442174024446976',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-97430781528009278955669206608191540911214288583714243278191899535271104058944',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-97430781528009278955669206608191540911214288583714243278190576812899460982921',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-4484280834982899386339876712021070801677686240476063982847630681967429947920',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-4484280834982899386339876712021070801677686240476063982849580210926536556579',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-35830987083353123895755779054112650157316399236059730431733743710891490551648',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-35830987083353123895755779054112650157316399236059730431718005638263302361616',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-35830987083353123895755779054112650157316399236059730431713574065421866334033',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-35830987083353123895755779054112650157316399236059730431699666172363286849574',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-4484280834982899386339876712021070801677686240476063982817239522845451035414',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-35830987083353123895755779054112650157316399236059730431735096448023648421216',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-35830987083353123895755779054112650157316399236059730431737752464526040703333',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-35830987083353123895755779054112650157316399236059730431719309693266663016809',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-4484280834982899386339876712021070801677686240476063982830561663425538396807',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-97430781528009278955669206608191540911214288583714243278201385790445570040066',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-97430781528009278955669206608191540911214288583714243278193187500893046936640',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-36174914148539116512882615125906196155176598740777344057324682489869474805575',
        '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-36174914148539116512882615125906196155176598740777344057338786883833218598195',
        '97-0xdd6a37f77754d194b5ec5bb2821bf29375e17da1-49600015852111813047896604022884353921118519942981476140030955576111085847079',
      ],
      address: '',
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/home/Home.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<FetchAllErc721And1155Query, FetchAllErc721And1155QueryVariables>({
    query: FetchAllErc721And1155Document,
    variables: {
      now: new Date('2022-05-22T04:53:29.881Z'),
      limit: 10,
      offset: 0,
      orderBy: 'CREATED_AT_DESC',
      filter: [],
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/home/Explorer.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<GetNotificationsQuery, GetNotificationsQueryVariables>({
    query: GetNotificationsDocument,
    variables: {
      address: '0x0000000000000000000000000000000000000000',
      cursor: null,
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/notification/Notification.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<GetAccountQuery, GetAccountQueryVariables>({
    query: GetAccountDocument,
    variables: {
      address: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/users/Form.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<CheckoutQuery, CheckoutQueryVariables>({
    query: CheckoutDocument,
    variables: {
      id: '02404aad-f713-4d5f-93fb-9023c32763ab',
      now: new Date('2022-05-02T23:03:00.000Z'),
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/offers/Checkout.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<FetchOwnedAssetsQuery, FetchOwnedAssetsQueryVariables>({
    query: FetchOwnedAssetsDocument,
    variables: {
      address: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
      limit: 10,
      offset: 0,
      orderBy: 'CREATED_AT_DESC',
      now: new Date('2022-05-02T23:03:00.000Z'),
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/user/OwnedAssets.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<OfferForAssetQuery, OfferForAssetQueryVariables>({
    query: OfferForAssetDocument,
    variables: {
      id: '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-49600015852111813047896604022884353921118519942981476140015855675123490232454',
      now: new Date('2022-06-04T00:46:00.000Z'),
      address: '',
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/offers/Form.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<FetchOnSaleAssetsQuery, FetchOnSaleAssetsQueryVariables>({
    query: FetchOnSaleAssetsDocument,
    variables: {
      address: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
      limit: 10,
      offset: 0,
      orderBy: 'CREATED_AT_DESC',
      now: new Date('2022-05-02T23:03:00.000Z'),
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/user/OnSaleAssets.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<BidOnAssetQuery, BidOnAssetQueryVariables>({
    query: BidOnAssetDocument,
    variables: {
      id: '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-49600015852111813047896604022884353921118519942981476140015855675123490232454',
      now: new Date('2022-06-04T00:28:00.000Z'),
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/offers/Bid.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<FetchCreatedAssetsQuery, FetchCreatedAssetsQueryVariables>({
    query: FetchCreatedAssetsDocument,
    variables: {
      address: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
      limit: 10,
      offset: 0,
      orderBy: 'CREATED_AT_DESC',
      now: new Date('2022-05-02T23:03:00.000Z'),
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/user/CreatedAssets.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<FetchUserBidsPlacedQuery, FetchUserBidsPlacedQueryVariables>({
    query: FetchUserBidsPlacedDocument,
    variables: {
      address: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
      limit: 10,
      offset: 0,
      orderBy: 'CREATED_AT_DESC',
      now: new Date('2022-05-02T23:03:00.000Z'),
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/user/BidPlaced.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<
    FetchAccountAndCollectionsQuery,
    FetchAccountAndCollectionsQueryVariables
  >({
    query: FetchAccountAndCollectionsDocument,
    variables: {
      account: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/asset/Form.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<FetchUserBidsReceivedQuery, FetchUserBidsReceivedQueryVariables>({
    query: FetchUserBidsReceivedDocument,
    variables: {
      address: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
      limit: 10,
      offset: 0,
      orderBy: 'CREATED_AT_DESC',
      now: new Date('2022-05-02T23:03:00.000Z'),
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/user/BidReceived.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<FetchUserAuctionsQuery, FetchUserAuctionsQueryVariables>({
    query: FetchUserAuctionsDocument,
    variables: {
      address: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
      limit: 10,
      offset: 0,
      orderBy: 'CREATED_AT_DESC',
      now: new Date('2022-05-02T23:03:00.000Z'),
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/user/Auctions.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<FetchUserFixedPriceQuery, FetchUserFixedPriceQueryVariables>({
    query: FetchUserFixedPriceDocument,
    variables: {
      address: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
      limit: 10,
      offset: 0,
      orderBy: 'CREATED_AT_DESC',
      now: new Date('2022-05-02T23:03:00.000Z'),
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/user/FixedPrices.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<FetchUserTradePurchasedQuery, FetchUserTradePurchasedQueryVariables>({
    query: FetchUserTradePurchasedDocument,
    variables: {
      address: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
      limit: 10,
      offset: 0,
      orderBy: 'TIMESTAMP_DESC',
      now: new Date('2022-05-02T23:03:00.000Z'),
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/user/TradePurchased.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<FetchUserTradeSoldQueryVariables, FetchUserTradeSoldQueryVariables>({
    query: FetchUserTradeSoldDocument,
    variables: {
      address: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
      limit: 10,
      offset: 0,
      orderBy: 'TIMESTAMP_DESC',
      now: new Date('2022-05-02T23:03:00.000Z'),
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/user/TradeSold.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)

client
  .query<FetchAssetQuery, FetchAssetQueryVariables>({
    query: FetchAssetDocument,
    variables: {
      id: '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-49600015852111813047896604022884353921118519942981476140015855675123490232454',
      now: new Date('2022-06-04T22:23:23.000Z'),
      address: '',
    },
  })
  .then(({ data }) =>
    writeFileSync(
      './src/asset/Detail.default.mock.json',
      JSON.stringify({ data }, null, 2),
    ),
  )
  .catch(console.error)
