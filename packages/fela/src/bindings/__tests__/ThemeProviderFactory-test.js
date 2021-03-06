import React, { createElement, Component, Children } from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import { html as beautify } from 'js-beautify'

import connectFactory from '../connectFactory'
import withThemeFactory from '../withThemeFactory'
import ThemeProviderFactory from '../ThemeProviderFactory'

const withTheme = withThemeFactory(Component, createElement, {
  theme: PropTypes.object
})

const ThemeProvider = ThemeProviderFactory(
  Component,
  children => Children.only(children),
  {
    propTypes: {
      theme: PropTypes.object.isRequired,
      overwrite: PropTypes.bool
    },
    childContextTypes: {
      theme: PropTypes.object
    },
    contextTypes: {
      theme: PropTypes.object
    },
    defaultProps: {
      overwrite: false
    }
  }
)

describe('Using the ThemeProvider', () => {
  it('should pass the theme to rule props', () => {
    const RenderTheme = withTheme(({ theme }) => (
      <div>{JSON.stringify(theme)}</div>
    ))

    const wrapper = mount(
      <ThemeProvider theme={{ color: 'red' }}>
        <RenderTheme />
      </ThemeProvider>
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should update child nodes if the theme updates', () => {
    const RenderTheme = withTheme(({ theme }) => (
      <div>{JSON.stringify(theme)}</div>
    ))

    const wrapper = mount(
      <ThemeProvider theme={{ color: 'red' }}>
        <RenderTheme />
      </ThemeProvider>
    )

    wrapper.setProps({ theme: { color: 'blue' } })

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should update child nodes through shouldComponentUpdate', () => {
    const RenderTheme = withTheme(({ theme }) => (
      <div>{JSON.stringify(theme)}</div>
    ))

    class NoUpdate extends Component {
      shouldComponentUpdate() {
        return false
      }

      render() {
        return this.props.children
      }
    }

    const wrapper = mount(
      <ThemeProvider theme={{ color: 'red' }}>
        <NoUpdate>
          <RenderTheme />
        </NoUpdate>
      </ThemeProvider>
    )

    wrapper.setProps({ theme: { color: 'blue' } })

    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
