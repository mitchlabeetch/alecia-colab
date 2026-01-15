// Convex Auth Configuration for Clerk
// Must match the main alepanel configuration for shared authentication

export default {
  providers: [
    {
      // Clerk custom domain issuer URL - SAME as alepanel
      domain: "https://clerk.alecia.markets",
      applicationID: "convex",
    },
  ],
};
