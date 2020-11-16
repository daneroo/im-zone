import React from 'react'
import { Swipeable } from 'react-swipeable'
import { useRouter } from 'next/router'
import { createGlobalStyle } from 'styled-components'
import Slide from '../components/Slide'
import PresentationMode from '../components/PresentationMode'
import useEventListener from '../hooks/useEventListener'
import { useTotalPages } from '../context/TotalPagesContext'
import { useMode } from '../context/ModeContext'
import { useCurrentSlide } from '../context/CurrentSlideContext'
import { Storage } from '../hooks/useStorage'
import { MODES } from '../constants/modes'

const GlobalStyle = createGlobalStyle`
  :root {
    --bg: #050505;
    --meta: #888;
    --accent: rgb(0, 92, 221);
    --text: #FAFAFA;
    --base: 1.5rem;
    --code: 1rem;
    --heading-font-family: "Poppins";
    --heading-font-weight: 700;
  }

  @media (max-width: 600px) {
    :root {
      --base: 1.2rem;
    }
  }

  * {
    box-sizing: border-box;
  }

  body,
  html {
    font-family: "Roboto", -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: var(--base);
    -webkit-font-smoothing: antialiased;
    font-feature-settings: 'calt', 'liga', 'hist', 'onum', 'pnum';

    overflow: auto;

    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;

    color: var(--text);
    background-color: var(--bg);
  }

  #slide {
    display: flex;
    overflow: hidden;
    justify-content: center;
    align-items: center;

    width: 100vw;
    height: 100vh;
    padding: 1rem;

    text-align: center;

    -webkit-overflow-scrolling: touch;
  }

  #slide ul,
  #slide ol {
    text-align: left;
  }

  #slide ol {
    /*margin-left: 32px;*/
    margin-left: 1.34rem;
    list-style: none;
    counter-reset: slide-ol-counter;
  }

  #slide ol li {
    counter-increment: slide-ol-counter;
    /* line height is better than margin-bottom for nested lists */
    line-height: 1.3;
  }

  #slide ol li::before {
    content: "0" counter(slide-ol-counter) ".";
    /*
    Poppins does not support  tabular-nums
    So we are Using Roboto wght:900 instead
    font-family: var(--heading-font-family);
    */
    font-weight: 900;
    font-variant-numeric: tabular-nums; /* numbers->monospace*/
    /* font-size: 2rem;  too big */
    margin-right: 0.5rem;
    letter-spacing:1px;
    line-height: 1;
  }


  /* mine */
  #slide ul {
    /*list-style-type: square;*/
    /*list-style-position: inside;*/
    /* To match ol's indentation of 1.33rem+ '0x.' */
    margin-left: 2.5rem;
  }

  #slide ul li {
    /* margin-bottom:0.5em; */
    line-height: 1.3;
  }

  a {
    color: var(--text);

    text-decoration-skip-ink: auto;
  }

  blockquote {
    font-size: 110%;
    font-weight: bold;

    width: 70vw;

    text-align: left;
  }

  @media (max-width: 900px) {
    blockquote {
      width: 90vw;
    }
  }

  blockquote div::before {
    content: '\\201C';
  }

  blockquote div::after {
    content: '\\201D';
  }

  cite {
    font-size: 80%;
    font-weight: normal;
    font-style: normal;

    display: block;

    margin-top: 2rem;
  }

  cite::before {
    content: '\\2014\\00a0';
  }

  pre {
    font-size: 0.75em !important;

    display: inline-block;
    overflow-x: scroll;

    margin: 2rem 0;

    text-align: left;

    color: var(--accent);
  }

  code {
    font-family: menlo, monospace;
  }

  a:hover {
    color: var(--accent);
  }

  h1 {
    font-family: var(--heading-font-family);
    font-weight: var(--heading-font-weight);
    font-size: 200%;

    margin-bottom: 0.5rem;
  }

  h2 {
    font-family: var(--heading-font-family);
    font-weight: var(--heading-font-weight);
    font-size: 120%;

    margin-bottom: 0.5rem;
  }

  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  header {
    font-size: 50%;

    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    padding: 20px;

    user-select: none;
  }

  header a,
  time {
    text-decoration: none;

    color: var(--meta);
  }

  header a:hover {
    color: var(--meta);
  }

  header span {
    color: var(--text);
  }
`

export default function SlidePage({ children }) {
  const { currentSlide, setSlide } = useCurrentSlide()
  const router = useRouter()
  const totalPages = useTotalPages()
  const { mode, setMode } = useMode()

  const NEXT = [13, 32, 39]
  const PREV = 37
  const PRESENTER = 80
  let slideCount = 0

  const navigate = ({ keyCode, altKey }) => {
    // Handle Presentation Mode shortcut
    if (altKey) {
      if (keyCode === PRESENTER) {
        if (mode === MODES.SPEAKER) {
          setMode(MODES.SLIDESHOW)
          router.push(
            router.pathname,
            `/slides/${router.query.slide}?mode=${MODES.SLIDESHOW}#${currentSlide}`,
            { shallow: true }
          )
        } else {
          setMode(MODES.SPEAKER)
          router.push(
            router.pathname,
            `/slides/${router.query.slide}?mode=${MODES.SPEAKER}#${currentSlide}`,
            { shallow: true }
          )
        }
        return false
      }
    }

    // Handle Previous page
    if (keyCode === PREV && currentSlide === 0) {
      if (router.query && router.query.slide) {
        if (router.query.slide > 1) {
          router.push(
            `/slides/${parseInt(router.query.slide, 10) - 1}?mode=${mode}#999`
          )
        }
      }
      return false
    }

    // Handle next page
    if (NEXT.indexOf(keyCode) !== -1 && currentSlide === slideCount) {
      if (router.query && router.query.slide) {
        // Check for max page count
        if (router.query.slide < totalPages) {
          router.push(
            `/slides/${parseInt(router.query.slide, 10) + 1}?mode=${mode}`
          )
        }
      }
      return false
    }

    // Handle slide changes
    if (NEXT.indexOf(keyCode) !== -1) {
      router
        .push(
          `${router.pathname}`,
          `/slides/${router.query.slide}?mode=${mode}#${currentSlide + 1}`
        )
        .then(() => {
          // wait for push to complete before calling setSlide
          // was causing render cancel errors
          setSlide(currentSlide + 1)
        })
    } else if (keyCode === PREV) {
      router
        .push(
          `${router.pathname}`,
          `/slides/${router.query.slide}?mode=${mode}#${currentSlide - 1}`
        )
        .then(() => {
          // wait for push to complete before calling setSlide
          // was causing render cancel errors
          setSlide(currentSlide - 1)
        })
    }
  }

  useEventListener('keydown', navigate)

  const swipeLeft = () => {
    navigate({ keyCode: NEXT[0] })
  }

  const swipeRight = () => {
    navigate({ keyCode: PREV })
  }

  const slideNotes = () => {
    let generatorCount = 0
    let generatedNotes = []
    // Filter down children by only Slides
    React.Children.map(children, (child) => {
      // Check for <hr> element to separate slides
      const childType = child && child.props && (child.props.mdxType || [])
      if (childType && childType.includes('hr')) {
        generatorCount += 1
        return
      }
      // Check if it's a SpeakerNotes component
      if (childType && childType.includes('SpeakerNotes')) {
        if (!Array.isArray(generatedNotes[generatorCount])) {
          generatedNotes[generatorCount] = []
        }
        generatedNotes[generatorCount].push(child)
      }
    })
    return generatedNotes
  }

  const renderSlide = () => {
    const generatedSlides = []
    let generatorCount = 0

    // Filter down children by only Slides
    React.Children.map(children, (child) => {
      // Check for <hr> element to separate slides
      const childType = child && child.props && (child.props.mdxType || [])
      if (childType && childType.includes('hr')) {
        generatorCount += 1
        return
      }

      // Check if it's a SpeakerNotes component
      if (childType && !childType.includes('SpeakerNotes')) {
        // Add slide content to current generated slide
        if (!Array.isArray(generatedSlides[generatorCount])) {
          generatedSlides[generatorCount] = []
        }
        generatedSlides[generatorCount].push(child)
      }
    })

    // Get total slide count
    slideCount = generatorCount

    // Return current slide
    if (currentSlide === 999) {
      router.push(
        router.pathname,
        `/slides/${router.query.slide}?mode=${mode}#${slideCount}`,
        { shallow: true }
      )
      setSlide(slideCount)
    }
    return <Slide>{generatedSlides[currentSlide]}</Slide>
  }

  return (
    <Swipeable onSwipedLeft={swipeLeft} onSwipedRight={swipeRight}>
      <GlobalStyle />
      <Storage />
      <PresentationMode
        mode={mode}
        notes={slideNotes()}
        currentSlide={currentSlide}
      >
        <div id="slide" style={{ width: '100%' }}>
          {renderSlide()}
        </div>
      </PresentationMode>
    </Swipeable>
  )
}
