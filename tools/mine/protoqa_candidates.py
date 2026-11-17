"""List ProtoQA (Family Feud survey) questions that could become Paco's Island questions.

ProtoQA: github.com/iesl/protoqa-data, CC BY 4.0 (Boratko et al., 2020).
Clone it first:  git clone --depth 1 https://github.com/iesl/protoqa-data.git /tmp/protoqa-data
Run:             python3 tools/mine/protoqa_candidates.py /tmp/protoqa-data > /tmp/protoqa.txt

The script keeps "Name a/an/something ..." prompts with at least five answer
clusters, drops prompts about personal relationships and bodies, and prints
each prompt with its top survey answers. A person or agent then picks the
prompts that have a fair, closed answer set, rewrites each one in house style
and builds the full answer list (see docs/QUESTION-WRITING.md). Survey counts
show which answers are common, which helps set tiers. Never paste the survey
answers in as the answer list; they are only the top few.
"""
import json, re, sys, os

root = sys.argv[1] if len(sys.argv) > 1 else '/tmp/protoqa-data'
files = ['data/train/train.jsonl', 'data/dev/dev.scraped.jsonl']
start = re.compile(r'^name (a|an|something|some|one|any) ')
skip = re.compile(r'\b(husband|wife|girlfriend|boyfriend|sex|naked|drunk|hate|kill|die|fat|ugly)\b')
for f in files:
    for line in open(os.path.join(root, f), encoding='utf-8', errors='replace'):
        d = json.loads(line)
        q = d['question']['normalized']
        clusters = d.get('answers', {}).get('clusters', {})
        answers = sorted(((c['count'], c['answers'][0]) for c in clusters.values()), reverse=True)
        if start.match(q) and not skip.search(q) and len(answers) >= 5:
            print(q, '|', ', '.join(f'{a} ({n})' for n, a in answers[:8]))
