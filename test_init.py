try:
    from app.agent import agent_executor
    with open('out.txt', 'w') as f: f.write("ALL GOOD")
except Exception as e:
    with open('out.txt', 'w', encoding='utf-8') as f: f.write(repr(e))

