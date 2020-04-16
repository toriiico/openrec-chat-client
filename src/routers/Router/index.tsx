import React from "react"
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom"

import Top from "../../views/components/environments/Top"
import Generator from "../../views/components/environments/Generator"

type MainProps = React.Props<{}>

const FComponent: React.FC<MainProps> = () => {
  return (
    <Router>
      <Switch>
        <Route exact={true} path="/" render={() => <Top />} />
        <Route exact={true} path="/generator" render={(props) => <Generator {...props} />} />

        <Redirect to="/" />
      </Switch>
    </Router>
  )
}

export default FComponent
