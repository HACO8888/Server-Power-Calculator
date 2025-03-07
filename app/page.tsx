"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PowerCalculator() {
  const [cpuModel, setCpuModel] = useState("E5-2687W v4");
  const [cpuCount, setCpuCount] = useState(2);
  const [ramCount, setRamCount] = useState(16);
  const [powerSupply, setPowerSupply] = useState(750);
  const [powerSupplyCount, setPowerSupplyCount] = useState(1);
  const [totalPower, setTotalPower] = useState(0);

  const fetchPowerData = async () => {
    const cpuPower: any = await getCpuPower(cpuModel);
    const ramPower: any = 3 * ramCount;
    const estimatedPower: any = cpuPower * cpuCount + ramPower;
    if (isNaN(estimatedPower)) {
      setTotalPower(0);
    } else {
      setTotalPower(estimatedPower);
    }
  };

  const getCpuPower = async (cpu: any) => {
    const result = await fetchAndSearch(cpu);
    return result?.tdp
  };

  async function fetchAndSearch(userInput: any) {
    console.log(userInput);
    if (userInput) {
      try {
        let response = await fetch('data.json');
        let data = await response.json();

        let result = data.find((cpu: { name: string; }) => cpu.name.toLowerCase().includes(userInput.toLowerCase()));

        return result || null;
      } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
      }
    }
    return null;
  }

  return (
    <div className="p-6 w-full h-full flex">
      <div className="flex flex-col mx-auto my-auto w-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">伺服器功耗計算</h2>
        <Card className="p-4 space-y-4">
          <div>
            <span>CPU 型號</span>
            <Input type="text" placeholder="E5-2687W v4" defaultValue={cpuModel} onChange={(e) => setCpuModel(e.target.value)} />
          </div>
          <div>
            <span>CPU 數量</span>
            <Input type="text" placeholder="2" defaultValue={cpuCount} onChange={(e) => setCpuCount(Number(e.target.value))} />
          </div>
          <div>
            <span>記憶體數量</span>
            <Input type="text" placeholder="16" defaultValue={ramCount} onChange={(e) => setRamCount(Number(e.target.value))} />
          </div>
          <div>
            <span>供電器瓦數</span>
            <Input type="text" placeholder="750" defaultValue={powerSupply} onChange={(e: any) => setPowerSupply(e.target.value)} />
          </div>
          <div>
            <span>供電器數量</span>
            <Input type="text" placeholder="2" defaultValue={powerSupplyCount} onChange={(e) => setPowerSupplyCount(Number(e.target.value))} />
          </div>
          <Button onClick={fetchPowerData}>計算</Button>
          <CardContent>
            <p>所需瓦數：{totalPower ?? 0}W</p>
            <p>可用瓦數：{powerSupply * powerSupplyCount}W</p>
            <p>供電狀態：{totalPower ? (totalPower > powerSupply * powerSupplyCount ? "❌ 供電不足" : "✅ 供電充足") : "⚠️ 請輸入內容來計算"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
