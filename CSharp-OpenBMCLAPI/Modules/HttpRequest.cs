﻿namespace CSharpOpenBMCLAPI.Modules
{
    internal class HttpRequest
    {
        public static HttpClient client;

        static HttpRequest()
        {
            client = new HttpClient()
            {
                //BaseAddress = new Uri("https://openbmclapi.staging.bangbang93.com/")
                BaseAddress = new Uri("https://openbmclapi.bangbang93.com/")
            };
            client.DefaultRequestHeaders.UserAgent.Add(new("openbmclapi-cluster", ClusterRequiredData.Config.clusterVersion));
        }
    }
}
