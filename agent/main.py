"""
Azure Diagram Builder Agent
Microsoft Agent Framework を使用し、azure-diagram-builder スキルを参照するエージェント。

使用方法:
  1. .env に AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT を設定
  2. python -m venv .venv && .venv\Scripts\activate
  3. pip install -r requirements-agent.txt
  4. python agent/main.py
"""

import asyncio
from pathlib import Path

from agent_framework import SkillsProvider
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity.aio import DefaultAzureCredential
from dotenv import load_dotenv
import os

load_dotenv()

SKILLS_DIR = Path(__file__).parent.parent / "skills"


async def create_agent():
    """スキル付き Azure Diagram Builder エージェントを作成する。"""
    credential = DefaultAzureCredential()

    skills_provider = SkillsProvider(
        skill_paths=SKILLS_DIR,
    )

    endpoint = os.environ["AZURE_OPENAI_ENDPOINT"]
    deployment = os.environ["AZURE_OPENAI_DEPLOYMENT"]

    agent = AzureOpenAIChatClient(
        credential=credential,
        endpoint=endpoint,
        deployment_name=deployment,
    ).as_agent(
        name="AzureDiagramAgent",
        instructions=(
            "あなたは Azure 構成図アシスタントです。\n"
            "ユーザーの自然言語による要件から、Azure Well-Architected Framework に準拠した\n"
            "アーキテクチャ構成図を提案します。\n"
            "スキル 'azure-diagram-builder' をロードして、リファレンスアーキテクチャパターンと\n"
            "Well-Architected の推奨事項を参照してください。\n"
            "日本語と英語の両方に対応してください。"
        ),
        context_providers=[skills_provider],
    )

    return agent, credential


async def main():
    """対話ループ: ユーザー入力 → エージェント応答。"""
    agent, credential = await create_agent()

    print("=" * 60)
    print("  Azure Diagram Builder Agent")
    print("  (Agent Framework + Skills)")
    print("  'quit' で終了")
    print("=" * 60)

    try:
        while True:
            user_input = input("\nあなた > ").strip()
            if not user_input:
                continue
            if user_input.lower() in ("quit", "exit", "q"):
                break

            response = await agent.run(user_input)
            print(f"\nAgent > {response.text}")
    finally:
        await credential.close()


if __name__ == "__main__":
    asyncio.run(main())
