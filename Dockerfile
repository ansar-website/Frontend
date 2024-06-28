FROM node:18.12.1-alpine

RUN mkdir -p /usr/src/academy/app
ENV PORT 8000

WORKDIR /usr/src/academy/app

# ENV NEXT_PUBLIC_CHANNEL production
# ENV NEXT_PUBLIC_GOOGLE_ANALYTICS
# ENV NEXT_PUBLIC_FACEBOOK_PIXEL_ID 
# ENV NEXT_PUBLIC_BASE_URL 

COPY package.json /usr/src/academy/app

RUN yarn install --production

COPY . /usr/src/academy/app

RUN yarn build

EXPOSE 8000
CMD [ "yarn", "start" ]
