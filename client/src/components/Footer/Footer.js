import React from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin
} from 'react-icons/fa';
import {
  FooterContainer,
  FooterLinksContainer,
  FooterLinksWrapper,
  FooterLinkItems,
  FooterLinkTitle,
  FooterLink,
  FooterContact,
  SocialMedia,
  SocialMediaWrap,
  SocialLogo,
  SocialIcon,
  WebsiteRights,
  SocialIcons,
  SocialIconLink
} from './FooterElements';

function Footer() {
  return (
    <FooterContainer>
      <FooterLinksContainer>
        <FooterLinksWrapper>
          <FooterLinkItems>
            <FooterLinkTitle>Contact Us</FooterLinkTitle>
            2451 Riverside Drive<br></br>
            Ottawa, Ontario<br></br>
            K1H 7X7<br></br><br></br>
            <FooterContact to='/'>General Inquiries:</FooterContact>
            <FooterContact to='/'>info@cspcalgary.ca</FooterContact>
            <FooterContact to='/'>Become a Ski Patroller</FooterContact>
            <FooterContact to='/'>join@cspcalgary.ca</FooterContact>
            <FooterContact to='/'>(613) 822-2245</FooterContact>
          </FooterLinkItems>
        </FooterLinksWrapper>
        <FooterLinksWrapper>
          <FooterLinkItems>
            <FooterLinkTitle>Canadian Ski Patrol</FooterLinkTitle>
            <FooterLink href={'//www.skipatrol.ca'}>National Page</FooterLink>
            <FooterLink href={'//www.skipatrol.ca/calgary/'}>Calgary Chapter</FooterLink>
            <FooterLink href={'//www.skipatrol.ca/calgary/'}>Registration</FooterLink>
            <FooterLink href={'//www.skipatrol.ca/faqs'}>FAQ</FooterLink>
          </FooterLinkItems>
        </FooterLinksWrapper>
      </FooterLinksContainer>
      <SocialMedia>
        <SocialMediaWrap>
          <SocialLogo to='/'>
            <SocialIcon />
            CSP
          </SocialLogo>
          <WebsiteRights>CSP © 2021</WebsiteRights>
          <SocialIcons>
            <SocialIconLink href={
              '//www.facebook.com/CSP.PCS'
            } target='_blank' aria-label='Facebook'>
              <FaFacebook />
            </SocialIconLink>
            <SocialIconLink href={
              '//www.twitter.com/CdnSkiPatrol'
            } target='_blank' aria-label='Twitter'>
              <FaTwitter />
            </SocialIconLink>
            <SocialIconLink href={
              '//www.linkedin.com/company/canadian-ski-patrol/'
            } target='_blank' aria-label='LinkedIn'>
              <FaLinkedin />
            </SocialIconLink>
            <SocialIconLink href={
              '//www.youtube.com/channel/UCWcjVziN5O79cUMgc9w4bFA'
            } target='_blank' aria-label='Youtube'>
              <FaYoutube />
            </SocialIconLink>
            <SocialIconLink href={
              '//www.instagram.com/cdnskipatrol/'
            } target='_blank' aria-label='Instagram'>
              <FaInstagram />
            </SocialIconLink>
          </SocialIcons>
        </SocialMediaWrap>
      </SocialMedia>
    </FooterContainer>
  );
}

export default Footer;
