import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
*{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Source Sans Pro', sans-serif;
}
`;

export default GlobalStyle;

export const Container = styled.div`
    z-index: 1;
    width: 100%;
    max-width: 1300px;
    margin-right: auto;
    margin-left: auto;
    padding-right: 50px;
    padding-left: 50px;

    @media screen and (max-width: 960px) {
        padding-right: 25px;
        padding-left: 25px;
    }
`;

export const ButtonPadding = styled.button`
    margin-left: 30px;
    border-radius: 4px;
    background: ${({primary}) => (primary ? '#4b59f7' : '#0467fb')};
    white-space: nowrap;
    padding: ${({big}) => (big ? '12px 64px' : '10px 20px')};
    color: #fff;
    font-size: ${({fontBig}) => (fontBig ? '20px' : '16px')};
    outline: none;
    border: none;
    cursor: pointer;

    &:hover {
        transition: all 0.3s ease-out;
        background: #fff;
        background: ${({primary}) => (primary ? '#0467fb' : '#4b59f7')};
    }

    @media screen and (max-width: 960px) {
        /* width: 35.5%; */
        padding-left: 0;
        width: 100%;
    }
  `;

export const Button = styled.button`
    border-radius: 4px;
    background: ${({primary}) => (primary ? '#4b59f7' : '#0467fb')};
    white-space: nowrap;
    padding: ${({big}) => (big ? '12px 64px' : '10px 20px')};
    color: #fff;
    font-size: ${({fontBig}) => (fontBig ? '20px' : '16px')};
    outline: none;
    border: none;
    cursor: pointer;

    &:hover {
        transition: all 0.3s ease-out;
        background: #fff;
        background: ${({primary}) => (primary ? '#0467fb' : '#4b59f7')};
    }

    @media screen and (max-width: 960px) {
        /* width: 35.5%; */
        width: 100%
    }
`;

export const SignOutButton = styled.button`
    border-radius: 4px;
    background: ${({primary}) => (primary ? '#de3366' : '#9e0505')};
    white-space: nowrap;
    padding: ${({big}) => (big ? '12px 64px' : '10px 20px')};
    color: #fff;
    font-size: ${({fontBig}) => (fontBig ? '20px' : '16px')};
    outline: none;
    border: none;
    cursor: pointer;

    &:hover {
        transition: all 0.3s ease-out;
        background: ${({primary}) => (primary ? '#9e0505' : '#de3366')};        
    }
    
    @media screen and (max-width: 960px) {
        /* width: 35.5%; */
        width: 100%
    }
`;

export const UserEditButton = styled.button`
    border-radius: 4px;
    background: ${({primary}) => (primary ? '#4b59f7' : '#0467fb')};
    white-space: nowrap;
    padding: ${({big}) => (big ? '12px 64px' : '10px 20px')};
    color: #fff;
    font-size: ${({fontBig}) => (fontBig ? '20px' : '16px')};
    outline: none;
    border: none;
    cursor: pointer;

    &:hover {
        transition: all 0.3s ease-out;
        background: #fff;
        background: ${({primary}) => (primary ? '#0467fb' : '#4b59f7')};
    }

    @media screen and (max-width: 960px) {
        /* width: 35.5%; */
        width: 100%
    }
`;

export const Input = styled.input`
    border-radius: 4px;
    width: 77%;
    height: 40px;
    margin-bottom: 20px;
    /* white-space: nowrap; */
    font-size: ${({fontBig}) => (fontBig ? '20px' : '16px')};
    border: 2px solid #0467fb;
    cursor: pointer;

    &:hover {
        transition: all 0.3s ease-out;
        background: #fff;
    }

    @media screen and (max-width: 960px) {
        width: 77%;
    }
`;


export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;

  @media screen and (max-width: 960px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const Card = styled.div`
    background: #fff;
    box-shadow: 0 6px 20px rgba(56, 125, 255, 0.2);
    border-radius: 10px;
    height: ${({ height }) => (height ? 'height' : '200px')};

    &:nth-child(n) {
        margin: 24px;
        padding: 24px;
    }

    &:nth-last-child(1) {
        margin: 24px;
        padding: 24px;
    }

    &:hover {
        transform: scale(1.06);
        transition: all 0.3s ease-out;
        color: #1c2237;
    }

    @media screen and (max-width: 960px) {
        width: 90%;

        &:hover {
            transform: none;
        }
    }
`;

export const TableCard = styled.div`
    background: #fff;
    box-shadow: 0 6px 20px rgba(56, 125, 255, 0.2);
    border-radius: 10px;
    height: auto;
    overflow-x: scroll;

    &:nth-child(n) {
        margin: 24px;
        padding: 24px;
    }

    &:nth-last-child(1) {
        margin: 24px;
        padding: 24px;
    }

    &:hover {
        transform: scale(1.06);
        transition: all 0.3s ease-out;
        color: #1c2237;
    }

    @media screen and (max-width: 960px) {
        width: 90%;

        &:hover {
            transform: none;
        }
    }
`;

export const InfoSec = styled.div`
  color: #fff;
  padding: 160px 0;
  background: ${({ lightBg }) => (lightBg ? '#fff' : '#101522')};
`;

export const InfoRow = styled.div`
  display: flex;
  margin: 0 -15px -15px -15px;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: ${({ imgStart }) => (imgStart ? 'row-reverse' : 'row')};
`;

export const InfoColumn = styled.div`
  margin-bottom: 15px;
  padding-right: 15px;
  padding-left: 15px;
  flex: 1;
  max-width: 50%;
  flex-basis: 50%;

  @media screen and (max-width: 768px) {
    max-width: 100%;
    flex-basis: 100%;
    display: flex;
    justify-content: center;
  }
`;

export const TextWrapper = styled.div`
  max-width: 540px;
  padding-top: 0;
  padding-bottom: 60px;

  @media screen and (max-width: 768px) {
    padding-bottom: 65px;
  }
`;

export const ImgWrapper = styled.div`
  max-width: 555px;
  display: flex;
  justify-content: ${({ start }) => (start ? 'flex-start' : 'flex-end')};
`;

export const TopLine = styled.div`
  color: ${({ lightTopLine }) => (lightTopLine ? '#a9b3c1' : '#4B59F7')};
  font-size: 18px;
  line-height: 16px;
  font-weight: 700;
  letter-spacing: 1.4px;
  margin-bottom: 16px;
`;

export const Img = styled.img`
  padding-right: 0;
  border: 0;
  max-width: 100%;
  vertical-align: middle;
  display: inline-block;
  max-height: 500px;
`;

export const Heading = styled.h1`
  margin-bottom: 24px;
  font-size: 48px;
  line-height: 1.1;
  font-weight: 600;
  color: ${({ lightText }) => (lightText ? '#f7f8fa' : '#1c2237')};
`;

export const Subtitle = styled.p`
  max-width: 440px;
  margin-bottom: 35px;
  font-size: 18px;
  line-height: 24px;
  color: ${({ lightTextDesc }) => (lightTextDesc ? '#a9b3c1' : '#1c2237')};
`;

export const UserCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;

  @media screen and (max-width: 2000px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const UserDescription = styled.p`
  display: inline-block;
  width: 50%;
  font-size: 16px;
  line-height: 10px;
  color: ${({ lightTextDesc }) => (lightTextDesc ? '#a9b3c1' : '#1c2237')};
`;

export const UserInput = styled.input`
    border-radius: 4px;
    width: 50%;
    height: 26px;
    font-size: 16px;
    border: ${({ editing }) => (editing ? '2px solid #0467fb' : '0px solid #0467fb')};
    cursor: pointer;
`;

export const UserHeadingInput = styled.input`
    margin-bottom: 10px;
    font-size: 30px;
    line-height: 1.1;
    font-weight: 600;
    color: ${({ lightText }) => (lightText ? '#f7f8fa' : '#1c2237')};
    border-radius: 4px;

    width: 100%;
    height: 40px;
    border: ${({ editing }) => (editing ? '2px solid #0467fb' : '0px solid #0467fb')};
    cursor: pointer;
`;

export const UserHeadingInputLink = styled.input`
    margin-bottom: 10px;
    font-size: 30px;
    line-height: 1.1;
    font-weight: 600;
    color: #007bff;
    border-radius: 4px;

    width: 100%;
    height: 40px;
    border: ${({ editing }) => (editing ? '2px solid #0467fb' : '0px solid #0467fb')};
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      color: #0056B3;
  }
`;

export const UserButton = styled.button`
    margin-top: 20px;
    margin-left: ${({useMargin}) => (useMargin ? useMargin : '0%')};
    border-radius: 4px;
    width: ${({width}) => (width ? width : '30%')};
    height: 36px;
    background: ${({primary}) => (primary ? '#4b59f7' : '#0467fb')};
    white-space: nowrap;
    color: #fff;
    font-size: 16px;
    outline: none;
    border: none;
    visibility: ${({hide}) => (hide ? 'hidden' : 'shown')};
    cursor: pointer;

    &:hover {
        transition: all 0.3s ease-out;
        background: #fff;
        background: ${({primary}) => (primary ? '#0467fb' : '#4b59f7')};
    }
`;

export const UserImage = styled.img`
    padding-right: 0;
    border: 0;
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
    max-height: 500px;
`;

export const UserTopContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 25px;
`;

export const Icon = styled.div`
  width: 33%;
  margin-left: 33%;
  color: #B8B8B8;
`;

export const FirstCard = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    background: #fff;
    box-shadow: 0 6px 20px rgba(56, 125, 255, 0.2);
    border-radius: 10px;
    height: ${({ height }) => (height ? 'height' : '200px')};

    &:nth-child(n) {
        margin: 24px;
        padding: 24px;
    }

    &:nth-last-child(1) {
        margin: 24px;
        padding: 24px;
    }

    &:hover {
        transform: scale(1.06);
        transition: all 0.3s ease-out;
        color: #1c2237;
    }

    @media screen and (max-width: 960px) {
        width: 90%;

        &:hover {
            transform: none;
        }
    }
`;
