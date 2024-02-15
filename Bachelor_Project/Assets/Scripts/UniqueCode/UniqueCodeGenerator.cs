using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UniqueCodeGenerator : MonoBehaviour
{
    public string GenerateCode()
    {
        string timeCode = DateTime.Now.ToString("HHmmss");
        int randomNum = UnityEngine.Random.Range(1000, 10000);
        string uniqueCode = timeCode + randomNum.ToString();
        return uniqueCode;
    }
}
