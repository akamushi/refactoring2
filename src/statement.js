"use strict";

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(plays, perf);
    // 注文の内訳を出力
    result += ` ${playFor(plays, perf).name}: ${format(
      amountFor(plays, perf) / 100
    )} (${perf.audience} seats)\n`;
    totalAmount += amountFor(plays, perf);
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

function volumeCreditsFor(plays, aPerformance) {
  let result = 0;
  // ボリューム得点のポイントを加算
  result += Math.max(aPerformance.audience - 30, 0);
  // 喜劇の時は10人につき、さらにポイントを加算
  if ("comedy" === playFor(plays, aPerformance).type)
    result += Math.floor(aPerformance.audience / 5);
  return result;
}

function playFor(plays, aPerformance) {
  return plays[aPerformance.playID];
}

function amountFor(plays, aPerformance) {
  let result = 0;
  switch (playFor(plays, aPerformance).type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;

    default:
      throw new Error(`unknown type: ${playFor(plays, aPerformance).type}`);
  }
  return result;
}

module.exports = statement;
