
import React from 'react'

import App from './'
import makeFlux from './flux'
import czz from 'czz'

const flux = makeFlux()

const div = document.createElement('div')
document.body.appendChild(div)

React.render(flux.wrap(<App/>), div)

czz.injectAll()

