FROM node:20

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

# Exponha a porta 4200, que é a porta padrão usada pelo Angular
EXPOSE 4200

# Servir o aplicativo Angular e especificar a porta correta
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
