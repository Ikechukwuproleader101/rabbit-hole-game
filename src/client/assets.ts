export const assets = {
  banner: '/assets/Banner.png',
  rabbitVisible: '/assets/Visible%20Rabbit.png',
  rabbitInvisible: '/assets/Invisible%20rabbit.png',
  infoBar1: '/assets/Info%20bar%201.png',
  navBar: '/assets/Nav%20Bar.png',
  connectorStyle1: '/assets/Connector01.png',
  connectorStyle2: '/assets/Connector02.png',
  connectorStyle3: '/assets/Connector03.png',
  connectorStyle4: '/assets/Connector04.png',
  connectorStyle5: '/assets/Connector05.png',
  screenSplash: '/assets/Screen1.png',
  screenMap: '/assets/Screen2.png',
  screenNoTwist: '/assets/Screen3.png',
  screenTwist: '/assets/Screen4.png',
  screenMissed: '/assets/Screen5.png',
  comments: '/assets/Comments.png',
  leaderboard: '/assets/leaderboard.png',
  news: '/assets/News.png',
} as const;

export type AssetKey = keyof typeof assets;
