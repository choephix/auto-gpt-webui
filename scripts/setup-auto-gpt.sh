#!/bin/bash
git clone https://github.com/Torantulino/Auto-GPT.git auto-gpt
git -C auto-gpt checkout 97f853a79d3ed3851ffc2d556d5e31720284fb24
pip install -r auto-gpt/requirements.txt
