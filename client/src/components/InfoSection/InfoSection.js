import React from 'react';
import { Link } from 'react-router-dom'
import { 
  Container, 
  Button, 
  ButtonPadding, 
  Input,
  InfoSec, 
  InfoRow, 
  InfoColumn, 
  TextWrapper,
  TopLine,
  Heading,
  Subtitle,
  ImgWrapper,
  Img
} from '../Elements/Elements'

const InfoSection = ({
    primary,
    lightBg,
    topLine,
    lightTopLine,
    lightText,
    lightTextDesc,
    headline,
    description,
    buttonLabel,
    img,
    alt,
    imgStart,
    start
}) => {
    return (
      <>
        <InfoSec lightBg={lightBg}>
          <Container>
            <InfoRow imgStart={imgStart}>
              <InfoColumn>
                <TextWrapper>
                  <TopLine lightTopLine={lightTopLine}>{topLine}</TopLine>
                  <Heading lightText={lightText}>{headline}</Heading>
                  <Subtitle lightTextDesc={lightTextDesc}>{description}</Subtitle>
                  <Link to='/sign-up'>
                    <Button big fontBig primary={primary} paddingLeft='10'>
                      {buttonLabel}
                    </Button>
                  </Link>
                </TextWrapper>
              </InfoColumn>
              <InfoColumn>
                <ImgWrapper start={start}>
                  <Img src={img} alt={alt} />
                </ImgWrapper>
              </InfoColumn>
            </InfoRow>
          </Container>
        </InfoSec>
      </>
    );
  }

export default InfoSection

export const SignInSection = ({
  primary,
  lightBg,
  topLine,
  lightTopLine,
  lightText,
  lightTextDesc,
  headline,
  description,
  buttonLabel,
  img,
  alt,
  imgStart,
  start
}) => {
  return (
    <>
      <InfoSec lightBg={lightBg}>
        <Container>
          <InfoRow imgStart={imgStart}>
            <InfoColumn>
              <TextWrapper>
                <TopLine lightTopLine={lightTopLine}>{topLine}</TopLine>
                <Heading lightText={lightText}>{headline}</Heading>
                <Subtitle lightTextDesc={lightTextDesc}>{description}</Subtitle>
                <Input defaultValue='usename'/>
                <div/>
                <Input defaultValue='password'/>
                <Link to='/sign-up'>
                  <Button big fontBig primary={primary}>
                    {'Sign Up'}
                  </Button>
                </Link>
                <Link to='/sign-up'>
                  <ButtonPadding big fontBig primary={primary}>
                    {buttonLabel}
                  </ButtonPadding>
                </Link>
              </TextWrapper>
            </InfoColumn>
            <InfoColumn>
              <ImgWrapper start={start}>
                <Img src={img} alt={alt} />
              </ImgWrapper>
            </InfoColumn>
          </InfoRow>
        </Container>
      </InfoSec>
    </>
  );
}
