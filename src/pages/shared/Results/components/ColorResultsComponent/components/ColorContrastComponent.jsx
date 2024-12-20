import React, { useCallback, useEffect, useState, useRef } from 'react';
import useEyeDropper from 'use-eye-dropper'
import { calcAPCA } from 'apca-w3';
import { HexColorPicker } from 'react-colorful';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputMask } from 'primereact/inputmask';
import { FaEyeDropper } from "react-icons/fa";

const CONTRAST_LOOKUP_TABLE = {
  LARGE_AA: 45,
  SMALL_AA: 60,
  LARGE_AAA: 60,
  SMALL_AAA: 75,
  ENHANCED: 90,
  OPTIMAL: 100
}

const ColorContrastComponent = () => {
    const { open, isSupported } = useEyeDropper()
    const [foreground, setForeground] = useState('')
    const [background, setBackground] = useState('')
    const [contrastValue, setContrastValue] = useState(null)
    const [displayColorPicker, setDisplayColorPicker] = useState(null);
    const [error, setError] = useState()

    const helpPanel = useRef(null);

    // Palette Handlers
    const handlePaletteClick = (key) => {
        setDisplayColorPicker(key);
    }
    const handlePaletteClose = () => {
        setDisplayColorPicker(null);
    };

    const pickColor = useCallback((event) => {
        // Using async/await (can be used as a promise as-well)
        const openPicker = async (event) => {
        console.log(event)
          try {
            const color = await open()

            if (event === "foreground") setForeground(color.sRGBHex)
            else if (event === "background") setBackground(color.sRGBHex)

          } catch (e) {
            // Ensures component is still mounted
            // before calling setState
            if (!e.canceled) setError(e)
          }
        }
        openPicker(event)
    }, [open])

    useEffect(() => {
      if (foreground && background) {
        // setContrastValue(colorContrast(foreground, background))
        setContrastValue(Math.abs(calcAPCA(foreground, background)))
      }
    }, [foreground, background])

    // Rendered Component
    return (
        <>
            <div className="flex align-items-center">
              <h2 className="mb-0">Color Contrast Analyser</h2>
              <Button icon="pi pi-question-circle" rounded text onClick={(e) => helpPanel.current.toggle(e)} />
              <OverlayPanel ref={helpPanel} pt={{root: {className: 'w-3'}}}>
                <p>This tool is based on the beta implementation of the APCA Guidlines that will be used in WCAG 3.</p>
                <p>The current WCAG 2 contrast is proven to be incorrect for human vision perception. The ACPA Guidlines provide a substantial improvement to this analysis.</p>
                <p>Readability is rated by the <a href="https://raw.githubusercontent.com/Myndex/apca-w3/master/images/APCAtableLegend.jpeg" target="_blank" rel="noreferrer">translation of the ACPA values to the current WCAG 2 guidlines.</a></p>
                <a href="https://readtech.org/ARC/" target="_blank" rel="noreferrer">Learn more</a>
              </OverlayPanel>
            </div>
            <div className="flex flex-column mt-2 mb-3">
              <div className="flex flex-nowrap align-items-center justify-content-center mb-3">

                {/* Foreground color selection */}
                <div className="mr-1">
                  <div className="p-inputgroup flex-1">
                    <InputMask mask="#***?***" slotChar="" placeholder="#Text Color" value={foreground ? foreground : null} onChange={(e) => setForeground(e.target.value)} />
                    <Button className="p-inputgroup-hexpicker" style={{backgroundColor: foreground}} onClick={(e) => handlePaletteClick('foreground')} />
                    { isSupported() &&  <Button outlined icon={() => <FaEyeDropper />} severity='secondary' onClick={() => pickColor("foreground")} /> }
                  </div>
                  { displayColorPicker === 'foreground' ? 
                    <div className="popover mt-2">
                        <div className="cover" onClick={handlePaletteClose} />
                        <HexColorPicker color={foreground} onChange={(e) => setForeground(e)} />
                    </div>
                  : null}
                </div>
                
                {/* Background color selection */}
                <div className="ml-1">
                  <div className="p-inputgroup flex-1 ml-1">
                    <InputMask mask="#***?***" slotChar="" placeholder="#Background Color" value={background ? background : null} onChange={(e) => setBackground(e.target.value)} />
                    <Button className="p-inputgroup-hexpicker" style={{backgroundColor: background}} onClick={(e) => handlePaletteClick('background')}  />
                    { isSupported() && <Button outlined icon={() => <FaEyeDropper />} severity='secondary' onClick={() => pickColor("background")} /> }
                  </div>
                  { displayColorPicker === 'background' ? 
                    <div className="popover mt-2">
                        <div className="cover" onClick={handlePaletteClose} />
                        <HexColorPicker color={background} onChange={(e) => setBackground(e)} />
                    </div>
                  : null}
                </div>

              </div>
              {contrastValue !== null ? 
                <div className="flex flex-column">
                  <div className={`contrast-overall ${contrastValue > CONTRAST_LOOKUP_TABLE.SMALL_AAA ? 'success'
                                                    : contrastValue > CONTRAST_LOOKUP_TABLE.LARGE_AA ? 'warning'
                                                    : 'danger'}`}>
                    <div className="contrast-overall-value">
                      <span>{Math.round((contrastValue + Number.EPSILON) * 100) / 100}</span>
                    </div>
                    <div className="contrast-overall-rating">
                      <i className={`pi pi-star-fill`}></i>
                      <i className={`pi ${contrastValue > CONTRAST_LOOKUP_TABLE.LARGE_AA ? 'pi-star-fill' : "pi-star"}`}></i>
                      <i className={`pi ${contrastValue > CONTRAST_LOOKUP_TABLE.SMALL_AA ? 'pi-star-fill' : "pi-star"}`}></i>
                      <i className={`pi ${contrastValue > CONTRAST_LOOKUP_TABLE.SMALL_AAA ? 'pi-star-fill' : "pi-star"}`}></i>
                      <i className={`pi ${contrastValue > CONTRAST_LOOKUP_TABLE.OPTIMAL ? 'pi-star-fill' : "pi-star"}`}></i>
                    </div>
                  </div>
                  <div className="flex flex-nowrap">
                    <div className={`contrast-small ${contrastValue > CONTRAST_LOOKUP_TABLE.SMALL_AAA ? 'success'
                                                    : contrastValue > CONTRAST_LOOKUP_TABLE.SMALL_AA ? 'warning'
                                                    : 'danger'}`}>
                      <span>Small Text</span>
                      <div className="contrast-small-rating">
                        <i className={`pi pi-star-fill`}></i>
                        <i className={`pi ${contrastValue > CONTRAST_LOOKUP_TABLE.SMALL_AA ? 'pi-star-fill' : "pi-star"}`}></i>
                        <i className={`pi ${contrastValue > CONTRAST_LOOKUP_TABLE.SMALL_AAA ? 'pi-star-fill' : "pi-star"}`}></i>
                      </div>
                    </div>
                    <div className={`contrast-large ${contrastValue > CONTRAST_LOOKUP_TABLE.LARGE_AAA ? 'success'
                                                    : contrastValue > CONTRAST_LOOKUP_TABLE.LARGE_AA ? 'warning'
                                                    : 'danger'}`}>
                      <span>Large Text</span>
                      <div className="contrast-large-rating">
                        <i className={`pi pi-star-fill`}></i>
                        <i className={`pi ${contrastValue > CONTRAST_LOOKUP_TABLE.LARGE_AA ? 'pi-star-fill' : "pi-star"}`}></i>
                        <i className={`pi ${contrastValue > CONTRAST_LOOKUP_TABLE.LARGE_AAA ? 'pi-star-fill' : "pi-star"}`}></i>
                      </div>
                    </div>
                  </div>
                </div>

                : <div className="no-contrast-value"><span>Select your text color and its background to analyse...</span></div>
              }
              
            </div>
            {!!error && <div>{error.message}</div>}
        </>
    )
};

export default ColorContrastComponent;
