import { createClient } from 'redis'
import { Service } from 'typedi'

export const client = createClient({
  url: 'redis://redis-14383.c17.us-east-1-4.ec2.cloud.redislabs.com:14383',
  auth_pass: 'ZK5Ggn2HF775Ihya0Ur4HocTD7MBK5cp'
})

@Service()
export class RedisService {
  public client = client
}