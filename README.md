# Teamboard

Teamboard is the next level of Internet.

## Dependencies

The client depends on both the [teamboard-io](https://github.com/N4SJAMK/teamboard-io), 
and [teamboard-api](https://github.com/N4SJAMK/teamboard-api) being installed and running. 
Please refer to their respective guides for installation.

## Installation

You need to have a few variables set before building the distribution.

`NODE_ENV` has to be set to `production` if you are setting the other
variables manually. If set to `development`, the client will try to connect
to services running on localhost. When set to `production`, you must declare
the other environmental variables with valid values.

- `API_HOST` and `API_PORT` correspond to the `teamboard-api` host and port
- `IO_HOST` and `IO_PORT` correspond to the `teamboard-io` host and port
- `STATIC_HOST` and `STATIC_PORT` correspond to where screenshots and stuff
  are hosted. Currently the static contet is being hosted by `teamboard-api`.
- `HOSTNAME` can be set if you want to test on IPad or something similar. This
  will mean that the `gulp` default task will run the server with the given
  hostname and that the application will try and connect to the given hostname
  for the `teamboard-api` and `teamboard-io` services.

Once you have set the required variables if any. You can build the distribution
with the command `gulp build`. If you have set the environment to `production`,
the app will use a minified version of the javascript. The result of the
`gulp build` command will give you a dist folder that you need to serve with
something like [nginx](http://nginx.org/).
