
import {Flux} from 'flammable/react'

export default function makeFlux() {
  const flux = new Flux()
  flux.addStore('doc', {}, {
    getPage(data, update) {
      update({$set: data})
    }
  })
  return flux
}

