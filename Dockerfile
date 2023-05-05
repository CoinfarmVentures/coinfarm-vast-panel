FROM mysql:8-debian

ARG BUILD_MYSQL_ROOT_PASSWORD
ENV MYSQL_ROOT_PASSWORD=$BUILD_MYSQL_ROOT_PASSWORD

RUN apt-get update && apt-get upgrade
# RUN apt-get install -y apt-transport-https
# RUN apt-get install -y software-properties-common wget
# RUN wget -q -O /usr/share/keyrings/grafana.key https://apt.grafana.com/gpg.key
# RUN `echo "deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main"` | tee -a /etc/apt/sources.list.d/grafana.list
# RUN apt-get update 
# RUN apt-get install grafana

RUN apt-get install -y wget
RUN wget https://dl.grafana.com/oss/release/grafana_9.4.7_amd64.deb
RUN apt-get install -y adduser libfontconfig1 systemctl 
# supervisor
RUN dpkg -i grafana_9.4.7_amd64.deb

RUN mkdir /run/grafana
RUN chown -R grafana /run/grafana
RUN systemctl daemon-reload
RUN systemctl enable grafana-server
#RUN systemctl start grafana-server
#RUN systemctl enable grafana-server.service

# COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# RUN systemctl status grafana-server
#&& systemctl start grafana-server

#CMD ["mysqld", "--user=root"]
#CMD ["/bin/bash", "-c", "echo FIRST COMMAND;echo SECOND COMMAND"]
# CMD ["/usr/bin/supervisord"]

RUN mysqld --initialize

COPY runner.sh /scripts/runner.sh
RUN ["chmod", "+x", "/scripts/runner.sh"]

ENTRYPOINT ["/scripts/runner.sh"]