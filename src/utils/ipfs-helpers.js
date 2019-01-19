const ipfsOptions = {
  repo: "/orbitdb/go",
  // start: true,
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        // Use IPFS dev signal server
        // "/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star"
        // "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
        // Use local signal server
        // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
      ]
    }
  }
};

const ipfs = new window.Ipfs(ipfsOptions);

const getIPFS = () => {
  if (window.ipfs) {
    return Promise.resolve(window.ipfs);
  }
  return new Promise((resolve, reject) => {
    ipfs.on("ready", async () => {
      window.ipfs = ipfs;
      resolve(ipfs);
    });
  });
};

export default getIPFS;
