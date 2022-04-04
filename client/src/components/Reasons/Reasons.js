import React from 'react';
import { BiPlusMedical} from 'react-icons/bi';
import { FaSkiing, FaSkiingNordic } from 'react-icons/fa';
import { GiSkis} from 'react-icons/gi';
import { IconContext } from 'react-icons/lib';
import {
  ReasonsSection,
  ReasonsWrapper,
  ReasonsHeading,
  ReasonsContainer,
  ReasonsCard,
  ReasonsCardInfo,
  ReasonsCardIcon,
  ReasonsCardPlan,
  ReasonsCardFeatures,
  ReasonsCardFeature
} from './Reasons.elements';

function Reasons() {
  return (
    <IconContext.Provider value={{ color: '#a9b3c1', size: 64 }}>
      <ReasonsSection>
        <ReasonsWrapper>
          <ReasonsHeading>Reasons to become a member</ReasonsHeading>
          <ReasonsContainer>
            <ReasonsCard to='/sign-up'>
              <ReasonsCardInfo>
                <ReasonsCardIcon>
                  <BiPlusMedical />
                </ReasonsCardIcon>
                <ReasonsCardPlan>EDUCATION & TRAINING</ReasonsCardPlan>
                <ReasonsCardFeatures>
                  <ReasonsCardFeature>As the leading authority in certifying ski patrollers and advanced first aid personnel for our on-snow resort partners, we are dedicated to the highest possible standards of education, certification and delivery in first aid and rescue services.</ReasonsCardFeature>
                </ReasonsCardFeatures>
              </ReasonsCardInfo>
            </ReasonsCard>
            <ReasonsCard to='/sign-up'>
              <ReasonsCardInfo>
                <ReasonsCardIcon>
                  <FaSkiing />
                </ReasonsCardIcon>
                <ReasonsCardPlan>YEAR ROUND EVENTS</ReasonsCardPlan>
                <ReasonsCardFeatures>
                  <ReasonsCardFeature>Over the past two decades, CSP services have extended beyond the ski hill to offer first aid/medical support, and full medical team coordination, for a long list of recreational, music and sporting events for many organizations.</ReasonsCardFeature>
                </ReasonsCardFeatures>
              </ReasonsCardInfo>
            </ReasonsCard>
            <ReasonsCard to='/sign-up'>
              <ReasonsCardInfo>
                <ReasonsCardIcon>
                  <GiSkis />
                </ReasonsCardIcon>
                <ReasonsCardPlan>MEMBER BENEFITS</ReasonsCardPlan>
                <ReasonsCardFeatures>
                  <ReasonsCardFeature>Includes advanced first aid training, area access privileges nationally, electronic monthly newsletter, insurance coverage, legal support, contacts and references, lots of skiing, relationship with CSIA (Local), pro-deal/supplier discounts.</ReasonsCardFeature>
                </ReasonsCardFeatures>
              </ReasonsCardInfo>
            </ReasonsCard>
            <ReasonsCard to='/sign-up'>
              <ReasonsCardInfo>
                <ReasonsCardIcon>
                  <FaSkiingNordic />
                </ReasonsCardIcon>
                <ReasonsCardPlan>SAFETY & INJURY PREVENTION</ReasonsCardPlan>
                <ReasonsCardFeatures>
                  <ReasonsCardFeature>Providing services in over 200 resorts across Canada, with approximately 4,000 highly trained volunteers on the slopes and trails, we promote safety and injury prevention.</ReasonsCardFeature>
                </ReasonsCardFeatures>
              </ReasonsCardInfo>
            </ReasonsCard>
          </ReasonsContainer>
        </ReasonsWrapper>
      </ReasonsSection>
    </IconContext.Provider>
  );
}
export default Reasons;
