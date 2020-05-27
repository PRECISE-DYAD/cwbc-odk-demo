# Installing sync endpoint (https + ldap reverse-proxy)

Adapted from: https://docs.odk-x.org/sync-endpoint/

## Prerequisites (e.g. ubuntu server)

- [docker](https://docs.docker.com/install/)
- [docker swarm mode](https://docs.docker.com/engine/swarm/swarm-tutorial/create-swarm/)
- [Java 8 JRE + JDK](https://www.linode.com/docs/development/java/install-java-on-ubuntu-16-04/)
- [mvn](https://maven.apache.org/install.html)
- [certbot](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx.html)
- A domain directed at the server (required for certbot validation check)

## Steps

### 1. Clone the setup repo

```
git clone https://github.com/odk-x/sync-endpoint-default-setup;
cd sync-endpoint-default-setup;
```

### 2. Create SSL certificate (replace email and domain name below)

```
sudo certbot certonly --standalone \
   --email "email@example.com" \
   -d "my-domain.com" \
   --rsa-key-size 4096 \
   --agree-tos \
   --cert-name bootstrap \
   --keep-until-expiring \
   --non-interactive
```

Check the certificate exists for your domain via `certbot certificates`

### 3. Build all the required docker images (this can take some time)

```
   git clone https://github.com/odk-x/sync-endpoint ; \
   docker build --pull -t odk/sync-web-ui https://github.com/odk-x/sync-endpoint-web-ui.git; \
   docker build --pull -t odk/db-bootstrap db-bootstrap; \
   docker build --pull -t odk/openldap openldap; \
   docker build --pull -t odk/phpldapadmin phpldapadmin; \
   mvn clean install -DskipTests=true -f ./sync-endpoint/pom.xml
```

Ensure all build steps pass successfully

### 4. Update configs

Add a location to serve phpldapadmin from (instead of port 40000)

```
location ^~ /ldap/ {
	proxy_pass https://phpldapadmin/;
}
```

_config/nginx/sync-endpoint-locations.conf_

Remove phpldapadmin port mapping (optional)
Provide nginx access to the ldap network.

```

phpldapadmin:
   # remove ports if wanted
   ports:
      - "${PHP_LDAPADMIN_PORT:-40000}:443"

nginx:
   image: nginx:mainline
   networks:
   - sync-network
   - ldap-network
```

_docker-compose.yml_

Make any other config changes required/as suggested from docs for passwords etc.
`ldap.env`,`sync.env`,`db.env`,`config/https.env`

### 5. Deploy (platform + script renewal)

```
docker stack deploy -c docker-compose.yml -c docker-compose-https.yml syncldap
```

The platform should be deployed and after a minute or so be available on the domain specified,
with phpldapadmin available at https://my-domain.com/ldap

## Alt deploy - via python script

A script does exist to automate the processes above, although requires installing
python on the device and manually making the config changes outlined above (it's also a bit fiddly)  
`sudo python init-odkx-sync-endpoint.py`

- prompt 1, enter host url in quotation marks - "my-domain.com"
- prompt 2, enter include https in quotation - "y"
- prompt 3, enter email in quotation - "email@example.com"
- prompt 4 - "y"

## Troubleshooting

### General

1. It can take up to a minute or so for the domain to become available, so wait.

2. Check stats to see if services running
   `docker stats`

3. Check logs for services (e.g. nginx, phpldapadmin)  
   `docker service ls`  
   `docker service logs syncldap_nginx`
   `docker service logs syncldap_phpldapadmin`

4. Retry deployment (removing previous stack and ensuring all containers stopped)

```
docker stack rm syncldap; \
docker stop $(docker ps -aq); \
docker stack deploy -c docker-compose.yml -c docker-compose-https.yml syncldap
```
