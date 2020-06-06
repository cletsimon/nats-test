#Testing NATS Streaming Server

```
npm init -y
npm install node-nats-streaming ts-node-dev typescript @types/node

# install typescript
npm install -g typescript
tsc --init

# Port Forwarding with Kubernetes (assuming there's already a running pod for nats-streaming-server)
kubectl get pods
kubectl port-forward [pod-name] 4222:422


# run publisher
npm run publish

# listener
npm run listen
```
