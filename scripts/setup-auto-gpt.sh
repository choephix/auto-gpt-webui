#!/bin/bash
git clone https://github.com/Torantulino/Auto-GPT.git auto-gpt
git -C auto-gpt checkout 4d42e14d3d3db3c64f1df0a425f5c3460bc82a56
pip install -r auto-gpt/requirements.txt
