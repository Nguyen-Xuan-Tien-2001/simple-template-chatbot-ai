import React, { AnchorHTMLAttributes } from 'react';

interface CustomLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string; // Make href potentially undefined to match the type from react-markdown
  children?: React.ReactNode;
  // You might receive other props from react-markdown as well
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, children, ...props }) => {
  if (!href) {
    return <>{children}</>; // Render children without a link if no href
  }


  return (
    <a className='text-blue-400' href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

export default CustomLink;