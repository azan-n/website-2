type SocialObjects = {
  // Iconify icon name
  icon: string;
  href: string;
  linkTitle: string;
}[];

export const SITE = {
  url: "https://azan-n.com",
  author: "azan-n",
  title: "azan-n",
  postPerPage: 20,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const SOCIALS: SocialObjects = [
  {
    icon: "ph:envelope-simple-duotone",
    href: "mailto:work@azan-n.com",
    linkTitle: `Email me.`,
  },
  {
    icon: "ph:github-logo-duotone",
    href: "https://github.com/azan-n",
    linkTitle: ` ${SITE.title} on GitHub`,
  },
];
