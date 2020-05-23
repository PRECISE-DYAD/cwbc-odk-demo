# Installing sync endpoint

Adapted from: https://docs.odk-x.org/sync-endpoint/

## Prerequisites (e.g. ubuntu server)

- [docker](https://docs.docker.com/install/)
- [docker swarm mode](https://docs.docker.com/engine/swarm/swarm-tutorial/create-swarm/)
- [java](https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-get-on-ubuntu-16-04)
- [mvn](https://maven.apache.org/install.html)
- [certbot](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx.html)
- A domain directed at the server

## Steps

### 1. Clone the setup repo

```
git clone https://github.com/odk-x/sync-endpoint-default-setup; \
cd sync-endpoint-default-setup
```

### 2. Create SSL certificate (replace email and domain name below)

```
sudo certbot certonly --standalone \
--email "apps@c2dev.co.uk" \
-d "odkx-sync.c2dev.co.uk" \
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

### 4. (optional) - Test the default setup is working

`docker stack deploy -c docker-compose.yml syncldap`  
After a minute or so the site should be available on your domain (via http, not https).
Home page should redirect to web login screen, phpldapadmin will not be available.  
If working remove:  
`docker stack rm syncldap; docker stop $(docker ps -aq)`

### 5. Update configs

Add a location to serve phpldapadmin from (instead of port 40000)

```
location ^~ /ldap/ {
	proxy_pass https://phpldapadmin/;
}
```

_config/nginx/sync-endpoint-locations.conf_

Remove phpldapadmin port mapping (optional)
Provide phpldapadmin access to generated certs.
Provide nginx access to the ldap network.

```

phpldapadmin:
   # remove ports if wanted
   ports:
      - "${PHP_LDAPADMIN_PORT:-40000}:443"
   volumes:
      - /etc/letsencrypt:/container/service/phpldapadmin/assets/apache2/certs
      - /etc/letsencrypt:/container/service/ldap-client/assets/certs


nginx:
   image: nginx:mainline
   networks:
   - sync-network
   - ldap-network
```

_docker-compose.yml_

Prevent self-certificate generation and pass certs to phpldapadmin

```
PHPLDAPADMIN_HTTPS_CRT_FILENAME=live/bootstrap/cert.pem
PHPLDAPADMIN_HTTPS_KEY_FILENAME=live/bootstrap/privkey.pem
PHPLDAPADMIN_HTTPS_CA_CRT_FILENAME=live/bootstrap/fullchain.pem
PHPLDAPADMIN_LDAP_CLIENT_TLS_CA_CRT_FILENAME=live/bootstrap/fullchain.pem
```

_ldap.env_

Make any other config changes required/as suggested from docs for passwords etc.

### 6. Deploy (platform + script renewal)

```
docker stack deploy -c docker-compose.yml -c docker-compose-https.yml syncldap
```

The platform should be deployed and after a minute or so be available on the domain specified,
with phpldapadmin available at https://my-domain.com/ldap

## Alt deploy - via python script

A script does exist to automate the processes above, although requires installing
python on the device and manually making the config changes outlined above (it's also a bit fiddly)   
`sudo python init-odkx-sync-endpoint.py`

- prompt 1, enter host url in quotation marks - "odkx-sync.c2dev.co.uk"
- prompt 2, enter include https in quotation - "y"
- prompt 3, enter email in quotation - "apps@c2dev.co.uk"
- prompt 4 - "y"

## Troubleshooting

1. It can take up to a minute or so for the domain to become available, so wait.

2. Check logs for services  
   `docker services ls`  
   `docker service logs syncldap_nginx`

3) Retry deployment (removing previous stack and ensuring all containers stopped)

```
docker stack rm syncldap; \
docker stop $(docker ps -aq); \
docker stack deploy -c docker-compose.yml -c docker-compose-https.yml syncldap
```

### Misc troubleshooting code snippets

Clear docker-compose (if copy-pasting))

```
rm docker-compose.yml; \
nano docker-compose.yml
```

Clear sync-endpoint-locations (if copy-pasting)

```
rm config/nginx/sync-endpoint-locations.conf; \
nano config/nginx/sync-endpoint-locations.conf;
```

List some services and logs

```
docker service ps syncldap_nginx
docker service ps syncldap_phpldapadmin
clear; docker service logs syncldap_nginx
clear; docker service logs syncldap_phpldapadmin
```

Run commands in service (note, will first need name of generated container)

```
docker container ls
```

Then can just use first digits of container name in exec command, e.g phpldapadmin id b7e43f253   
`docker exec -it b7 ls /container/service/phpldapadmin/assets/apache2/certs/live`

# Initialising Users

See main docs https://docs.odk-x.org/sync-endpoint/#ldap

# Recommended workflow improvements

- [ ] update documentation for requirements (e.g. python, certbot)
- [ ] create prebuilt mvn install image
- [ ] fix https of phpldapadmin (and proxy port to subdomain/url)
- [ ] improve python scripts (allow default inputs, give /ldap option)

# Misc notes

- working Ubuntu 16/18/20(?) on own vm
- Failed heroku (can't install docker with swarm)