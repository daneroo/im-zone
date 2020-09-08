import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Container } from 'theme-ui'
import Layout from '../components/layout/ClassicHolyGrail'
import SiteHeader from '../components/layout/SiteHeader'

// modified frm  default: https://nextjs.org/docs/advanced-features/custom-document
class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render () {
    return (
      <Html>
        <Head />
        <body>
          <Layout
            header={<SiteHeader />}
            left={<div />}
            right={<div />}
            main={
              <>
                <Container>
                  <Main />
                  <NextScript />
                </Container>
              </>
            }
            footer={<div>Daniel Lauzon &copy; 2020</div>}
          />
        </body>
      </Html>
    )
  }
}

export default MyDocument
