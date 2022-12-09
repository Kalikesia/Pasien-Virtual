import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import { listWord, findBestMatch } from '../actions/wordActions'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const mountedStyle = {
  animation: "inAnimation 350ms ease-in"
};
const unmountedStyle = {
  animation: "outAnimation 350ms ease-out",
  animationFillMode: "forwards"
};

export default function Home() {
  const dispatch = useDispatch();
  const [menuNumber, setMenuNumber] = useState(0)
  const [activeButton, setActiveButton] = useState(0)
  const [detailsModal, setDetailsModal] = useState(false)
  const [detailsUpdate, setDetailsUpdate] = useState(false)
  const [detailsArray, setDetailsArray] = useState([])
  const [userWord, setUserWord] = useState("")
  const [accuracyOutput, setAccuracyOutput] = useState("")

  useEffect(() => {
    document.title = "Smart Pasivik - Pasien Virtual"
    dispatch(listWord())
  }, [dispatch])

  const submitTesting = async(e) => {
    e.preventDefault();
  
    setAccuracyOutput(await dispatch(findBestMatch(userWord)))
  }

  const wordList = useSelector((state) => state.databaseList);
  const { category, products, error } = wordList;

  return (
    <>
    <h1>pasivik.kalikesia</h1>
    <p className = "sub-title">tim pasien virtual</p>

    <div id = "menu-container">
      <div className = "menu-info">
      <h4>
          Application Information
        </h4>
        <p>Contact For Any Problems!</p>
        <div className = 'icon-text'>
          <i class ="fa fa-phone" aria-hidden="true"></i>
          <span>085385000223 (zulfikar)</span>
        </div>
        <div className = 'icon-text'>
          <i class ="fa fa-envelope-o" aria-hidden="true"></i>
          <span>fikarpra@gmail.com</span>
        </div>
        <div className = 'icon-text'>
          <i class ="fa fa-map-marker" aria-hidden="true"></i>
          <span>Universitas Gadjah Mada, Yogyakarta, Indonesia</span>
        </div>
        <div className = "social-media">
          <a href = "#" className = "icon-circle">
            <i class="fa fa-facebook-official" aria-hidden="true"></i>
          </a>
          <a href = "#" className = "icon-circle">
            <i class="fa fa-twitter" aria-hidden="true"></i>
          </a>
          <a href = "#" className = "icon-circle">
            <i class="fa fa-instagram" aria-hidden="true"></i>
          </a>
          <a href = "#" className = "icon-circle">
            <i class="fa fa-youtube" aria-hidden="true"></i>
          </a>
        </div>
        <div className = "menu-tab">
          <button className = {activeButton == 0 ? "active" : "undefined"} onClick = {() => {setMenuNumber(0); setActiveButton(0)}}>DISPLAY</button>
          <button className = {activeButton == 1 ? "active" : "undefined"} onClick = {() => {setMenuNumber(1); setActiveButton(1)}}>INPUT</button>
          <button className = {activeButton == 2 ? "active" : "undefined"} onClick = {() => {setMenuNumber(2); setActiveButton(2)}}>COMPARE</button>
        </div>
      </div>
      {menuNumber == 0 &&
      <div className = "database-container"  style = {menuNumber == 0 ? mountedStyle : unmountedStyle}>{products?.data.map((dataItems, key) => {
        return <div className = "database-column">
        <h3>Category: {dataItems.category}</h3>
        <p>Master: {dataItems.master}</p>
        <p>Keyword: {dataItems.keyword}</p>
        <button onClick={() => {setDetailsModal(true); setDetailsArray(dataItems)}}>Details</button>
        <button onClick={() => {setDetailsUpdate(true); setDetailsArray(dataItems)}}>Update</button>
        <button>Delete</button>
      </div>
      })}
      </div>
      }
      {menuNumber == 1 &&
      <form style = {menuNumber == 1 ? mountedStyle : unmountedStyle}>
      <div className = "col">
        <div className = "form-group solo">
          <label>Master</label>
          <textarea></textarea>
        </div>
      </div>
      <div className = "col">
        <div className = "form-group">
          <label>Varians 1</label>
          <input type="text" />
        </div>
        <div className = "form-group">
          <label>Varians 2</label>
          <input type="text" />
        </div>
      </div>
      <div className = "col">
        <div className = "form-group">
          <label>Varians 3</label>
          <input type="text" />
        </div>
        <div className = "form-group">
          <label>Varians 4</label>
          <input type="text" />
        </div>
      </div>
      <div className = "col">
        <div className = "form-group">
          <label>Varians 5</label>
          <input type="text" />
        </div>
        <div className = "form-group">
          <label>Varians 6</label>
          <input type="text" />
        </div>
      </div>
      <div className = "col">
        <div className = "form-group">
          <label>Varians 7</label>
          <input type="text" />
        </div>
        <div className = "form-group">
          <label>Varians 8</label>
          <input type="text" />
        </div>
      </div>
      <div className = "col">
        <div className = "form-group">
          <label>Varians 9</label>
          <input type="text" />
        </div>
        <div className = "form-group">
          <label>Varians 10</label>
          <input type="text" />
        </div>
      </div>
      <div className = "col">
        <div className = "form-group solo right">
          <button className = "primary">Send Message</button>
        </div>
      </div>
    </form>
    }
    {menuNumber == 2 &&
      <div className = "testing-container"  style = {menuNumber == 2? mountedStyle : unmountedStyle}>
        <div className = "col">
          <div className = "form-group solo">
            <h1>Master</h1>
            <textarea value={userWord} onChange = {(e) => setUserWord(e.target.value)}></textarea>
          </div>
        </div>
        <h1 className = "testing-title">Output</h1>
        <div className = "testing-output">
          <p>{accuracyOutput?.message}</p>
        </div>
        <div className = "form-group solo right">
          <button className = "primary" onClick = {submitTesting}>Send Testing</button>
        </div>
      </div>
    }
    </div>
    <div className = { detailsModal == true ? "modal-background" : "modal-background hidden"}>
      <div className = "modal-menu">
        <div>
          <button onClick = {() => {setDetailsModal(false)}}></button>
          <h3 className = "category">{detailsArray.category}</h3>
          <p className = "subcategory">master: {detailsArray.master}</p>
          <p className = "subcategory">keyword: {detailsArray.keyword}</p>
          <h3 className = "varians">Varians</h3>
          <ul> {detailsArray.varians?.map((varian, key) => {return <li>{varian}</li>})}
          </ul>
        </div>
      </div>
    </div>
    <div className = { detailsUpdate == true ? "modal-background" : "modal-background hidden"}>
      <div className = "modal-update">
        <div>
          <button className = "close" onClick = {() => {setDetailsUpdate(false)}}></button>
          <form>
            <div className = "col">
              <div className = "form-group solo">
                <label>Master</label>
                <textarea value={detailsArray.master}></textarea>
              </div>
            </div>  
            <div className = "form-group">
              <label>Keyword</label>
              <input type="text" value={detailsArray.keyword} />
            </div>
            <div className = "col">
              <div className = "form-group">
                <label>Varians 1</label>
                <input type="text" />
              </div>
              <div className = "form-group">
                <label>Varians 2</label>
                <input type="text" />
              </div>
            </div>
            <div className = "col">
              <div className = "form-group">
                <label>Varians 3</label>
                <input type="text" />
              </div>
              <div className = "form-group">
                <label>Varians 4</label>
                <input type="text" />
              </div>
            </div>
            <div className = "col">
              <div className = "form-group">
                <label>Varians 5</label>
                <input type="text" />
              </div>
              <div className = "form-group">
                <label>Varians 6</label>
                <input type="text" />
              </div>
            </div>
            <div className = "col">
              <div className = "form-group">
                <label>Varians 7</label>
                <input type="text" />
              </div>
              <div className = "form-group">
                <label>Varians 8</label>
                <input type="text" />
              </div>
            </div>
            <div className = "col">
              <div className = "form-group">
                <label>Varians 9</label>
                <input type="text" />
              </div>
              <div className = "form-group">
                <label>Varians 10</label>
                <input type="text" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
