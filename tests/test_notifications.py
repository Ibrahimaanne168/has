import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from routes.notifications_utils import notifier_utilisateurs


def test_notifier_utilisateurs_ignores_empty_user_ids():
    class DummyDB:
        def cursor(self, *args, **kwargs):
            raise AssertionError('cursor should not be used when user ids are empty')

    assert notifier_utilisateurs(DummyDB(), [], 'info', 'hello', '/x') is None
