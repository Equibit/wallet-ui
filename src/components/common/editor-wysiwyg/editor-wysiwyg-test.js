import assert from 'chai/chai';
import 'steal-mocha';
import { ViewModel } from './editor-wysiwyg';

describe('wallet-ui/components/common/editor-wysiwyg', function () {
  it('should have message', function () {
    var vm = new ViewModel();
    assert.equal(vm.message, 'This is the editor-wysiwyg component');
  });
});
