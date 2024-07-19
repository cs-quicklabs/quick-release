# Quick Release
##  Introduction
A lot of SaaS products have to do a lot of things again and again for proper management of customer feedbacks, bugs and they often need to communicate with their users what they are building. Therefore lot of SaaS Products end up building lot of common features which generally waste time which can be focused on other business needs. Therefore we are building a product named Quick Releases, which provides these common features to different SaaS products owners. They can integrate Quick Release with their own SaaS products and save some bandwidth. These modules/features include



#### Change logs:
Change logs or release notes are needed to tell users what are new in the SaaS products.

#### Roadmaps: 
Roadmaps are way to informing users of SaaS products what features are coming, what is under development and what is coming next.



#### Feedbacks: 
Almost every product needs a way to collect feedbacks from it's users. We are building this feature in Quick Release.



#### Bug Reporting: 
So that users can quickly report bugs and send it to SaaS product owners. This is some very basic bug reporting mechanism.



Quick Releases when integrated with some SaaS product will enable above features out of the box to SaaS product and SaaS owners do not have to build these features themselves. This because a lot more useful if you are running lot of projects like we do in Quicklabs.

## Setup Process

First, run the development server:

1. Run the package installation cmd.
```
npm install
```
2. Now set the prisma and posgres for db connection
```
// update the env from env.example file
```
3. Make sure your $POSTGRES_PRISMA_URL file is update based on your db server
4. Run the migration command
- for dev
```
npx prisma db push
```
- for prod
```
npx prisma migrate deploy
```

5. Now run the next js server
```
npm run dev
```

After above steps open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


