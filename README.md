This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## この辺を参考に
https://github.com/supabase/supabase/tree/master/examples/slack-clone/nextjs-slack-clone

https://zenn.dev/uhyo/articles/jotai-v2-async-sometimes

https://vercel.com/wednesdaydevelopers-projects/home-made-messenger

https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app

https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=platform&platform=web&queryGroups=environment&environment=server&queryGroups=framework&framework=nextjs

https://www.youtube.com/watch?v=XgqCh2FwNVY

## URL Configuration にURLパターンを追加
Supabase の Authentication の URL Configuration の Redirect URLs において、
認証プロバイダのコールバックURLのパターンをという録する必要あり！
https://supabase.com/dashboard/project/xvijoffudglkddvssasf/auth/url-configuration
