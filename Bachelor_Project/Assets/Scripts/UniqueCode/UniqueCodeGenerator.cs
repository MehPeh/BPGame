using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UniqueCodeGenerator : MonoBehaviour
{
    public string GenerateCode()
    {
        string timeCode = DateTime.Now.ToString("mmss");
        int randomNum = UnityEngine.Random.Range(100, 1000);
        string uniqueCode = timeCode + randomNum.ToString();
        
        // Convert the unique code to hexadecimal to shorten it
        string hexCode = ConvertToHex(uniqueCode);

        return hexCode;
    }

    private string ConvertToHex(string originalCode)
    {
        long decimalValue = long.Parse(originalCode);
        string hexValue = decimalValue.ToString("X");

        return hexValue;
    }
}
