using System;
using System.Net;
using System.Net.Sockets;

public class IPAddressFinder
{
      /*
      public static string GetLocalIPv4()
      {
            string localIPv4 = string.Empty;

            foreach (var networkInterface in System.Net.NetworkInformation.NetworkInterface.GetAllNetworkInterfaces())
            {
                  var ipProperties = networkInterface.GetIPProperties();

                  foreach (var ip in ipProperties.UnicastAddresses)
                  {
                        if (ip.Address.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip.Address))
                        {
                              localIPv4 = ip.Address.ToString();
                              break;
                        }
                  }
                  if (!string.IsNullOrEmpty(localIPv4))
                  {
                        break;
                  }
            }
            return localIPv4;
      }
      */
}