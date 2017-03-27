const __html__ = window.__html__
export const id = '__inject_wrapper__'

export function inject (name) {
  let wrapper = document.getElementById(id)
  const fragment = __html__[`${name}.html`]

  if (wrapper) {
    wrapper.innerHTML = fragment
  } else {
    wrapper = document.createElement('div')
    wrapper.id = id
    wrapper.innerHTML = fragment
    document.body.appendChild(wrapper)
  }
}

export function clear () {
  let wrapper = document.getElementById(id)
  wrapper.remove()
}
