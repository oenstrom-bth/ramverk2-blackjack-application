const token = require("./token");

test("test sign()", () => {
    const hash = token.sign("test");
    
    expect(typeof hash).toBe("string");
    expect(hash).toHaveLength(114);
});


test("test verify()", () => {
    const hash = token.sign("test");
    const verified = token.verify(hash);
    
    expect(verified).toBe("test");
});
