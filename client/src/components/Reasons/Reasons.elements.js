import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const ReasonsSection = styled.div`
  padding: 100px 0 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;
`;

export const ReasonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  @media screen and (max-width: 960px) {
    margin: 0 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const ReasonsHeading = styled.h1`
  color: #383838;
  font-size: 48px;
  margin-bottom: 24px;
`;

export const ReasonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 960px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

export const ReasonsCard = styled(Link)`
  background: #fff;
  box-shadow: 0 6px 20px rgba(56, 125, 255, 0.2);
  width: 265px;
  height:450px;
  text-decoration: none;
  border-radius: 4px;

  &:nth-child(2) {
    margin-left: 24px;
  }
  &:nth-child(3) {
    margin-left: 24px;
  }
  &:nth-child(4) {
    margin-left: 24px;
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

    &:nth-child(2) {
      margin-left: 0px;
      margin-top: 24px;
    }

    &:nth-child(3) {
      margin-left: 0px;
      margin-top: 24px;
    }

    &:nth-child(4) {
      margin-left: 0px;
      margin-top: 24px;
    }
  }
`;

export const ReasonsCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  padding: 24px;
  align-items: center;
  color: #1c2237;
`;

export const ReasonsCardIcon = styled.div`
  margin: 24px 0;
`;

export const ReasonsCardPlan = styled.h3`
  margin-bottom: 5px;
  text-align: center;
  font-size: 24px;
`;

export const ReasonsCardCost = styled.h4`
  font-size: 40px;
`;

export const ReasonsCardLength = styled.p`
  font-size: 14px;
  margin-bottom: 24px;
`;

export const ReasonsCardFeatures = styled.div`
  margin: 16px 0 32px;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #686868;
`;

export const ReasonsCardFeature = styled.li`
  margin-bottom: 10px;
`;
