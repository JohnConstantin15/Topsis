import Head from 'next/head'
import _ from 'lodash'
import "bootstrap/dist/css/bootstrap.min.css"
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import watches, { Watch } from '../data/watches'
import React, { useState } from 'react'
import { country, lifetime, material, mechanism } from '../data/default'
import topsis from '../util/topsis'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [selectedWatches, setSelectedWatches] = useState<Watch[]>([])
  function handleSelect(watch: Watch) {
    const pos = selectedWatches.findIndex(x => x.model == watch.model)
    if (pos == -1) {
      setSelectedWatches([...selectedWatches, watch])
    } else {
      setSelectedWatches(selectedWatches.filter(x => x.model != watch.model))
    }
  setK(undefined)
  }
  const [localCoefs, setLocalCoefs] = useState<any>({})
  const [k, setK] = useState<{[key:string]:number}[]|undefined>(undefined)
  function handleSolve(){
    if(selectedWatches.length==0){
      return
    }
    const c=topsis(selectedWatches,localCoefs)
    let a:any={}
    for (let i = 0; i < selectedWatches.length; i++) {
      const e = selectedWatches[i];
      a[e.model]=c[i]
      
    }
    setK(a)
    setMaxK(Math.max(...c))
  }
  const [showNumbers, setShowNumbers] = useState(false)
  const [maxK, setMaxK] = useState(-1)
  console.log(k)
  return (
    <>
      <Container>
        <Row>
          <Col>
            <h1>Material</h1>
            {_.uniqBy(_.orderBy(watches,x=>material[x.material],"desc"), "material").map(x => <div key={x.model}>{x.material}<Form.Range onChange={e => {
              const a = { ...localCoefs, }
              a[x.material] = e.target.value
              setLocalCoefs(a)
            }} min={0} max="10" value={localCoefs[x.material] || material[x.material] || 0} /></div>)}
          </Col>
          <Col>
            <h1>Mechanism</h1>
            {_.uniqBy(_.orderBy(watches,x=>mechanism[x.mechanism],"desc"), "mechanism").map(x => <div key={x.model}>{x.mechanism}<Form.Range onChange={e => {
              const a = { ...localCoefs, }
              a[x.mechanism] = e.target.value
              setLocalCoefs(a)
            }} min={0} max="10" value={localCoefs[x.mechanism] || mechanism[x.mechanism] || 0} /></div>)}
          </Col>
          <Col>
            <h1>Origin</h1>
            {_.uniqBy(_.orderBy(watches,x=>country[x.origin],"desc"), "origin").map(x => <div key={x.model}>{x.origin}<Form.Range onChange={e => {
              const a = { ...localCoefs, }
              a[x.origin] = e.target.value
              setLocalCoefs(a)
            }} min={0} max="10" value={localCoefs[x.origin] || country[x.origin] || 0} /></div>)}
          </Col>
        </Row>
        <Table>
          <tbody>
            <tr>
              <th>Model</th>
              <th>Price</th>
              <th>Matereal</th>
              <th>Power Reserve</th>
              <th>Liquidity</th>
              <th>Service Availability</th>
              <th>Mechanism</th>
              <th>Water-Resist</th>
              <th>Origin</th>
              <th>Compare</th>
              <th><Button onClick={handleSolve}>Solve</Button></th>
              <th><Button onClick={()=>setShowNumbers(!showNumbers)} variant={showNumbers?"primary":"outline-primary"}>Show Results</Button></th>
            </tr>

            {_.orderBy(watches,x=>((k||{}as any)[x.model])||0,"desc").map(x => <tr className={`${(k||{}as any)[x.model]==maxK?"bg-success text-light":""}`} key={x.model}>
              <td>{x.model}</td>
              <td>{x.price}</td>
              <td>{x.material}</td>
              <td>{x.lifetime}</td>
              <td>{x.populirity}</td>
              <td>{x.support}</td>
              <td>{x.mechanism}</td>
              <td>{x.waterResist}</td>
              <td>{x.origin}</td>
              <td>
                <Form.Check checked={!!selectedWatches.find(y => y.model == x.model)} onClick={() => handleSelect(x)} />
                
              </td>
              
            <td>{showNumbers && (k||{} as any)[x.model]}</td>
            </tr>)}
          </tbody>
        </Table>

      </Container>
    </>
  )
}
